import google.generativeai as genai
import PIL.Image
import json
import os

# Authenticate Gemini
genai.configure(api_key="AIzaSyC1f61j-VZUjkqNJZdhumpoON2ZZZjTcjY")

# === CONFIG ===
image_path = "data/lowers/download.jpg"  # Folder containing the images
item_type = "lower"  # or "lower"
output_json = "clothing_items.json"

# Load all images in the folder

# Define Gemini prompt
prompt = """
You are a fashion assistant. Describe this clothing item in detail. Your output should be very descriptive and should cover every aspect of the clothing item.
Mention: type (e.g., hoodie, shirt), material, color, fit (e.g., loose, slim), and style (casual, formal, etc.).
I don't want any extra text explaining what you are doing. Directly start the description.
"""

# Initialize list to hold clothing entries
clothing_items = []
last_id = 4


# Process each image

# Load the image
img = PIL.Image.open(image_path)

# Call Gemini API
model = genai.GenerativeModel('gemini-2.0-flash')
response = model.generate_content([prompt, img])
description = response.text.strip()

# Create the structured entry
clothing_entry = {
    "id": len(clothing_items) + last_id + 1,  # Unique ID based on the current number of entries
    "path": image_path,
    "type": item_type,
    "description": description
}

# Append new item to the list
clothing_items.append(clothing_entry)

# === Save to JSON ===

# Check if file exists
if os.path.exists(output_json):
    with open(output_json, "r") as f:
        existing_items = json.load(f)
else:
    existing_items = []

# Merge the new items with existing ones
existing_items.extend(clothing_items)

# Save updated JSON
with open(output_json, "w") as f:
    json.dump(existing_items, f, indent=4)

print(f"✅ Descriptions saved to {output_json}")
print("📄 Entries:", clothing_items)
