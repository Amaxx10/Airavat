from flask import Flask,request, jsonify
import google.generativeai as genai
from serpapi import GoogleSearch
import os
import json
import requests
from flask_cors import CORS
from dotenv import load_dotenv

# Set up the environment variables for API keys
app = Flask(__name__)
# cors = CORS(app)
CORS(app)
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-1.5-pro-latest")

@app.route('/')
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
