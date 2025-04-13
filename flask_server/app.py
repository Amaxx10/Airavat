from flask import Flask, request, jsonify
import google.generativeai as genai
from serpapi import GoogleSearch
import os
import json
import requests
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# Set up the environment variables for API keys
app = Flask(__name__)
cors = CORS(app)
load_dotenv()

# MongoDB Configuration
try:
    mongo_client = MongoClient(os.getenv('MONGODB_URL'))
    db = mongo_client['test']
    closet_collection = db['closets']  # Add collection for closet
    feed_images_collection = db['feedimages']
    print(closet_collection.count_documents({}))
    print("MongoDB connected successfully!")
except ConnectionFailure as e:
    print(f"MongoDB connection error: {e}")

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-1.5-pro-latest")

@app.route('/', methods=['GET'])
def home():
    return 'Welcome to Flask Server!'

@app.route('/api/get_query', methods=['GET', 'POST'])
def get_query():
    try:
        print("Received request data:", request.get_json())
        data = request.get_json()
        if not data or 'image_id' not in data:
            return {'error': 'No image ID provided'}, 400
        print(data)
        # Get image from MongoDB using the ID
        image_doc = db['feedimages'].find_one({'feed_id': data['image_id']})
        # image_doc = db['feedimages'].find_one()
        # print(image_doc)  # Uncommented to log the image document
        if not image_doc:
            return {'error': 'Image not found in database'}, 404
            
        # Get base64 image data
        image_data = image_doc['image']
        
        # Decode base64 to bytes
        import base64
        image_bytes = base64.b64decode(image_data)
        
        # Process image data for Gemini
        image_parts = [
            {
                "mime_type": "image/png",
                "data": image_bytes
            }
        ]
        
        prompt = (
            "You are a fashion expert helping build a clothing search engine.\n"
            "Look at the image and generate a concise search query for online shopping.\n"
            "The query should include:\n"
            "- Clothing type\n"
            "- Color\n"
            "- Gender targeting (men's, women's, unisex)\n"
            "- Style (casual, formal, etc.)\n"
            "Avoid full sentences. Just return a short, comma-separated search phrase like: 'black unisex jeans casual'."
        )

        response = gemini_model.generate_content([prompt, image_parts])
        product_links = get_product_links(response.text.strip().replace("\n", ""))
        return {'query': response.text.strip().replace("\n", ""), 'product_links': product_links}

    except Exception as e:
        print(f"[ERROR] Error generating search query: {e}")
        return {'error': str(e)}, 500
    
def get_product_links(query):
    serp_api_key = os.getenv("SERPAPI_KEY")
    if not serp_api_key:
        print("Error: SerpAPI key not set in environment variables.")
        return []
    
    if not query:
        print("Error: No query provided.")
        return []
    params = {
        "engine": "google_shopping",
        "q": query,
        "api_key": serp_api_key
    }

    print(f"\n🔍 Search Query: {query}")
    
    search = GoogleSearch(params)
    results = search.get_dict()
    shopping_results = results.get("shopping_results", [])
    
    print("[DEBUG] Full API Response:", results)

    product_links = []
    for i, item in enumerate(shopping_results[:5]):
        link = item.get("product_link")
        if link:
            product_links.append(link)

    return product_links

def extract_numbers(text):
    """Extract the first two numbers from text."""
    import re
    numbers = re.findall(r'\d+', text)
    return [int(num) for num in numbers[:2]] if len(numbers) >= 2 else None

def get_clothing_suggestion(upper_items, lower_items, preferences=None, weather="Sunny, 31 degrees", occasion="casual"):
    prompt = f"""
    You are a fashion expert. Select the best clothing combination using only the available items.
    
    Requirements:
    1. Respond ONLY with two numbers: first for upper garment, second for lower garment
    2. Format example: "1 2" or "1,2" (just the numbers)
    
    User preferences:
    {preferences if preferences else 'No specific preferences'}
    
    Weather: {weather}
    Occasion: {occasion}
    
    Upper garments:
    {"\n".join([f"{item['dress_id']}. {item['description']}" for item in upper_items])}
    
    Lower garments:
    {"\n".join([f"{item['dress_id']}. {item['description']}" for item in lower_items])}
    """
    
    response = gemini_model.generate_content(prompt)
    return response.text.strip()

@app.route('/api/ai-styling', methods=['POST'])
def get_ai_styling():
    try:
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 415
            
        data = request.get_json()
        preferences = data.get('preferences', None)
        weather = data.get('weather', "Sunny, 31 degrees")
        occasion = data.get('occasion', "casual")

        # Fetch clothing items from MongoDB
        upper_items = list(closet_collection.find({"dress_type": "upper garment"}))
        lower_items = list(closet_collection.find({"dress_type": "lower garment"}))
        if not upper_items or not lower_items:
            return jsonify({'error': 'No clothing items found in closet'}), 404

        # Get AI suggestion
        suggestion = get_clothing_suggestion(
            upper_items, 
            lower_items,
            preferences,
            weather,
            occasion
        )

        # Extract numbers from the suggestion
        numbers = extract_numbers(suggestion)
        if not numbers:
            return jsonify({'error': 'Could not extract valid clothing IDs from AI response'}), 500

        upper_id, lower_id = numbers
        
        return jsonify({
            'upper_garment_id': upper_id,
            'lower_garment_id': lower_id,
            'weather': weather,
            'occasion': occasion,
            'preferences': preferences
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)