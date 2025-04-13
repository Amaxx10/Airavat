import google.generativeai as genai
import PIL.Image
import json
import os
from pymongo import MongoClient
import io
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key='AIzaSyBaYFDALGVb0wwpZX8hQSF2I-VUeSgmRSs')

# Connect to MongoDB
try:
    mongo_client = MongoClient('mongodb+srv://amankanojia22:amanmongo@cluster0.fx2kc.mongodb.net/')
    db = mongo_client["test"]
    closet_collection = db["closets"]
    print("MongoDB connected successfully!")
except Exception as e:
    print(f"MongoDB connection error: {e}")
    exit(1)

# Define Gemini prompt
prompt = """
You are a fashion assistant. Describe this clothing item in detail. Your output should be very descriptive and should cover every aspect of the clothing item.
Mention: type (e.g., hoodie, shirt), material, color, fit (e.g., loose, slim), and style (casual, formal, etc.).
I don't want any extra text explaining what you are doing. Directly start the description.
"""

def process_image(image_data):
    try:
        # Remove the "data:image/jpeg;base64," prefix if it exists
        if image_data.startswith("data:image"):
            image_data = image_data.split(",")[1]
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_data)
        
        # Save temporary image file
        temp_image_path = "./temp/temp_image.jpg"
        os.makedirs(os.path.dirname(temp_image_path), exist_ok=True)  # Ensure temp directory exists
        with open(temp_image_path, "wb") as temp_file:
            temp_file.write(image_bytes)
        
        # Load image using PIL
        image = PIL.Image.open(temp_image_path).convert("RGB")
        
        # Call Gemini API
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        response = model.generate_content([prompt, image])
        
        # Clean up temporary file
        os.remove(temp_image_path)
        
        return response.text.strip()
    except Exception as e:
        print(f"Error processing image: {e}")
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)
        return None

def update_closet_descriptions():
    # Get all items from closet
    closet_items = closet_collection.find({})
    
    for item in closet_items:
        try:
            # Get image data
            if 'image' not in item:
                print(f"No image found for item {item.get('_id')}")
                continue
                
            print(f"Processing item {item.get('_id')}...")
            
            # Generate description
            new_description = process_image(item['image'])
            
            if new_description:
                # Update the document with new description
                closet_collection.update_one(
                    {"_id": item["_id"]},
                    {"$set": {"description": new_description}}
                )
                print(f"Updated description for item {item.get('_id')}")
            
        except Exception as e:
            print(f"Error processing item {item.get('_id')}: {e}")

if __name__ == "__main__":
    print("Starting closet description update process...")
    update_closet_descriptions()
    print("Process completed!")