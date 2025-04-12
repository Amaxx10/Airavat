from flask import Flask,request, jsonify
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
# CORS(app)
load_dotenv()

# MongoDB Configuration
try:
    mongo_client = MongoClient(os.getenv('MONGODB_URL'))
    db = mongo_client['test']
    closet_collection = db['closet']  # Add collection for closet
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
        if not data or 'image' not in data:
            return {'error': 'No image data provided'}, 400
            
        # Get base64 image data from JSON
        image_data = data['image']
        
        # Decode base64 to bytes
        import base64
        image_bytes = base64.b64decode(image_data)
        
        # Process image data for Gemini
        image_parts = [
            {
                "mime_type": "image/png",  # Adjust mime type if needed
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
        return {'query': response.text.strip().replace("\n", "")}

    except Exception as e:
        print(f"[ERROR] Error generating search query: {e}")
        return {'error': str(e)}, 500

@app.route('/api/get_product_links', methods=['POST'])
def get_product_links():
    serp_api_key = os.getenv("SERPAPI_KEY")
    if not serp_api_key:
        print("Error: SerpAPI key not set in environment variables.")
        return []

    query = json.loads(request.data).get("query")
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
    
    print("[DEBUG] Full API Response:", results)  # Optional debug output

    product_links = []
    for i, item in enumerate(shopping_results[:5]):
        link = item.get("product_link")
        if link:
            product_links.append(link)

    return product_links

def get_clothing_suggestion(upper_items, lower_items, preferences=None, weather="Sunny, 31 degrees", occasion="casual"):
    # Format preferences into a readable string
    pref_string = ""
    if preferences:
        pref_string = f"""
        Gender: {preferences.get('gender', 'Not specified')}
        Body Shape: {preferences.get('bodyShape', 'Not specified')}
        Skin Tone: {preferences.get('skinTone', 'Not specified')}
        Style Preferences: {', '.join(preferences.get('stylePreferences', []))}
        Color Preferences: {', '.join(preferences.get('colorPreferences', []))}
        """

    upper_description = "\n".join([f"{item['dress_id']}. {item['description']}" for item in upper_items])
    lower_description = "\n".join([f"{item['dress_id']}. {item['description']}" for item in lower_items])
    
    prompt = f"""
    Act as an experienced fashion designer with great taste in selecting clothes and very good fashion sense.
    The user has the following characteristics and preferences:
    {pref_string or 'No specific preferences provided'}
    
    The weather today is:
    {weather}
    
    The occasion for the user is:
    {occasion}
    
    The following are the descriptions of the upper body garments:
    {upper_description}
    
    The following are the descriptions of the lower body garments:
    {lower_description}
    
    Using the user's characteristics, preferences, weather conditions, and occasion, select one upper body garment and one lower body garment most suitable.
    Consider skin tone compatibility with colors, body shape with clothing fit, and style preferences.
    
    Just give me the number of the upper body garment and lower body garment that you select.
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

        # Get AI suggestion with updated preferences
        suggestion = get_clothing_suggestion(
            upper_items, 
            lower_items,
            preferences,
            weather,
            occasion
        )

        # Parse the suggestion to get dress IDs
        try:
            upper_id, lower_id = map(int, suggestion.split())
            return jsonify({
                'upper_garment_id': upper_id,
                'lower_garment_id': lower_id,
                'weather': weather,
                'occasion': occasion,
                'preferences': preferences
            })
        except ValueError as e:
            return jsonify({'error': f'Invalid suggestion format: {str(e)}'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
