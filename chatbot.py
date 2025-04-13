import os
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

# Load Gemini API key from .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Initialize Gemini model (for vision + text)
model = genai.GenerativeModel('gemini-2.0-flash')

def init_chat():
    chat = model.start_chat(history=[
        {
            "role": "user", 
            "parts": [
                """You're a fashion-aware chatbot with a friendly personality, a hint of sarcasm, and a love for compliments.
                Only mildly roast users — never be mean. Prioritize uplifting the user if they express vulnerability.
                When given user preferences, use them to personalize fashion advice and recommendations.
                Keep responses fashion-focused when discussing style choices.
                Consider weather, occasion, and style preferences when giving advice.
                """
            ]
        },
        {
            "role": "model",
            "parts": ["Ready to serve looks and sass in equal measure! 💃✨"]
        }
    ])
    return chat

# Start a chat session to maintain context
chat = init_chat()

def analyze_input(chat_instance, user_input, preferences=None, is_image=False):
    try:
        # Add preferences context if available
        if preferences:
            context = "Consider these style preferences while responding:\n"
            if preferences.get('gender'):
                context += f"- Gender: {preferences['gender']}\n"
            if preferences.get('skinTone'):
                context += f"- Skin tone: {preferences['skinTone']}\n"
            if preferences.get('bodyShape'):
                context += f"- Body shape: {preferences['bodyShape']}\n"
            if preferences.get('stylePreferences'):
                context += f"- Style preferences: {', '.join(preferences['stylePreferences'])}\n"
            if preferences.get('colorPreferences'):
                context += f"- Color preferences: {', '.join(preferences['colorPreferences'])}\n"
            
            user_input = f"{context}\nUser message: {user_input}"

        if is_image:
            if isinstance(user_input, str):
                image = Image.open(user_input)
            else:
                image = user_input
            response = chat.send_message(image)
        else:
            response = chat.send_message(user_input)
        
        return response.text

    except Exception as e:
        return f"Okay, okay... I clearly messed up 😅. Here's the error: {str(e)}. Mind giving it another shot?"