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
from PIL import Image
import io
import datetime
from .tryon_utils import process_virtual_tryon
import base64

# Set up the environment variables for API keys
app = Flask(__name__)
cors = CORS(app)
load_dotenv()

# MongoDB Configuration
try:
    mongo_client = MongoClient(os.getenv("MONGODB_URL"))
    db = mongo_client["test"]
    closet_collection = db["closets"]  # Add collection for closet
    feed_images_collection = db["feedimages"]
    userpreferences_collection = db["preferences"]
    generated_collection = db["generated"]  # Add collection for generated images
    print(closet_collection.count_documents({}))
    print("MongoDB connected successfully!")
except ConnectionFailure as e:
    print(f"MongoDB connection error: {e}")

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-1.5-pro-latest")


@app.route("/", methods=["GET"])
def home():
    return "Welcome to Flask Server!"


@app.route("/api/get_query", methods=["GET", "POST"])
def get_query():
    try:
        print("Received request data:", request.get_json())
        data = request.get_json()
        if not data or "image_id" not in data:
            return {"error": "No image ID provided"}, 400
        print(data)
        # Get image from MongoDB using the ID
        image_doc = db["feedimages"].find_one({"feed_id": data["image_id"]})
        # image_doc = db['feedimages'].find_one()
        if not image_doc:
            return {"error": "Image not found in database"}, 404

        # Get base64 image data
        image_data = image_doc["image"]

        # Decode base64 to bytes
        import base64

        image_bytes = base64.b64decode(image_data)

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Process image data for Gemini
        # image_parts = [
        #     {
        #         "mime_type": "image/jpeg",
        #         "data": image_file
        #     }
        # ]

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

        response = gemini_model.generate_content([prompt, image])
        product_links = get_product_links(response.text.strip().replace("\n", ""))
        return {
            "query": response.text.strip().replace("\n", ""),
            "product_links": product_links,
        }

    except Exception as e:
        print(f"[ERROR] Error generating search query: {e}")
        return {"error": str(e)}, 500


def get_product_links(query):
    serp_api_key = os.getenv("SERPAPI_KEY")
    if not serp_api_key:
        print("Error: SerpAPI key not set in environment variables.")
        return []

    if not query:
        print("Error: No query provided.")
        return []
    params = {"engine": "google_shopping", "q": query, "api_key": serp_api_key}

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

    numbers = re.findall(r"\d+", text)
    return [int(num) for num in numbers[:2]] if len(numbers) >= 2 else None


def get_clothing_suggestion(
    upper_items,
    lower_items,
    preferences=None,
    weather="Sunny, 31 degrees",
    occasion="casual",
):
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
    print(f"Prompt for AI: {prompt}")
    response = gemini_model.generate_content(prompt)
    return response.text.strip()


@app.route("/api/ai-styling", methods=["POST"])
def get_ai_styling():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 415
        data = request.get_json()
        print(data)
        preferences = data.get("user_preferences", None)
        weather = data.get("weather", "Sunny, 31 degrees")
        occasion = data.get("occasion", "casual")

        # Fetch clothing items from MongoDB
        upper_items = list(closet_collection.find({"dress_type": "upper garment"}))
        lower_items = list(closet_collection.find({"dress_type": "lower garment"}))
        if not upper_items or not lower_items:
            return jsonify({"error": "No clothing items found in closet"}), 404

        # Get AI suggestion
        suggestion = get_clothing_suggestion(
            upper_items, lower_items, preferences, weather, occasion
        )

        # Extract numbers from the suggestion
        numbers = extract_numbers(suggestion)
        if not numbers:
            return (
                jsonify(
                    {"error": "Could not extract valid clothing IDs from AI response"}
                ),
                500,
            )

        upper_id, lower_id = numbers

        return jsonify(
            {
                "upper_garment_id": upper_id,
                "lower_garment_id": lower_id,
                "weather": weather,
                "occasion": occasion,
                "preferences": preferences,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Add chatbot instance
from .chatbot import analyze_input, init_chat

# Initialize chatbot instance with no initial preferences
chat_instance = init_chat()


@app.route("/api/chat", methods=["POST"])
def chat_endpoint():
    try:
        if not request.is_json:
            return (
                jsonify(
                    {"success": False, "error": "Content-Type must be application/json"}
                ),
                415,
            )

        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"success": False, "error": "Message is required"}), 400

        message = data.get("message")

        # Fetch descriptions and dress IDs from MongoDB
        descriptions_get = closet_collection.find({}, {"description": 1, "dress_id": 1, "_id": 0})
        descriptions = [
            {"description": item["description"], "dress_id": item["dress_id"]}
            for item in descriptions_get
        ]

        # Get preferences from MongoDB using the schema structure
        preferences = userpreferences_collection.find_one({}, {"_id": 0})
        if not preferences:
            preferences = {
                "gender": None,
                "skinTone": None,
                "bodyShape": None,
                "stylePreferences": [],
                "colorPreferences": [],
            }

        # Pass structured preferences and descriptions to analyze_input
        response = analyze_input(chat_instance, message, preferences=preferences, descriptions=descriptions)

        return jsonify(
            {
                "success": True,
                "response": response,
                "timestamp": datetime.datetime.now().isoformat(),
            }
        )

    except Exception as e:
        print(f"Chat error: {str(e)}")  # Server-side logging
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/virtual-tryon", methods=["POST"])
def virtual_tryon():
    try:
        if "person_image" not in request.files or "cloth_image" not in request.files:
            return jsonify({"error": "Missing required images"}), 400

        person_image = request.files["person_image"]
        cloth_image = request.files["cloth_image"]

        # Process virtual try-on
        result_image = process_virtual_tryon(person_image, cloth_image)

        # Store the generated image in MongoDB
        generated_collection.delete_many({})  # Ensure only one unique entry exists
        generated_collection.insert_one({"image": base64.b64encode(result_image).decode("utf-8")})

        # Fetch the stored image
        stored_image = generated_collection.find_one({}, {"_id": 0, "image": 1})
        if not stored_image:
            return jsonify({"error": "Failed to retrieve generated image"}), 500

        # Send the image in base64 format
        return jsonify({"success": True, "result": stored_image["image"]})

    except Exception as e:
        print(f"Virtual try-on error: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
