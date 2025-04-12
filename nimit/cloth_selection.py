import google.generativeai as genai
import json
import ast

# Authenticate Gemini
genai.configure(api_key="AIzaSyC1f61j-VZUjkqNJZdhumpoON2ZZZjTcjY")

# Define the path to the JSON file
json_file_path = 'clothing_items.json'

# Load the clothing items from the JSON file
with open(json_file_path, 'r') as f:
    clothing_items = json.load(f)

# Prepare the descriptions for upper and lower body garments
upper_body_items = [item for item in clothing_items if item['type'] == 'upper']
lower_body_items = [item for item in clothing_items if item['type'] == 'lower']

exclusion_list = []
inclusion_list = []
# Generate descriptions for the upper and lower garments
# upper_description = "\n".join([f"{item['id']}. {item['description']}" for item in upper_body_items if item['id'] not in exclusion_list])
# lower_description = "\n".join([f"{item['id']}. {item['description']}" for item in lower_body_items if item['id'] not in exclusion_list])

feedback = ""
suggestion = "None"

def exclude_from_list(feedback):
    global exclusion_list
    feedback_prompt = f"""
    The user gave this feedback about the previous outfit suggestion: "{feedback}"

    Here are the clothing items with their IDs and descriptions:

    Upper body items:
    {upper_description}

    Lower body items:
    {lower_description}

    Please tell me:
    1. Whether the feedback indicates a strong preference for a specific item type or color (YES/NO).
    2. If YES, return a list of keywords to include in future selection (e.g., ["green", "shorts"])
    3. If the feedback is about disliking something, return a list of item IDs to exclude.
    Only return in this format as a string: {{"include": [...], "exclude": [...]}} and nothing else
    """

    print(feedback_prompt)
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(feedback_prompt)
    suggestion = response.text.strip()
    dct = ast.literal_eval(suggestion)
    print(suggestion)

    # print(type(suggestion))
    exclusion_dict = dct
    print(type(exclusion_dict))
    print(exclusion_dict)
    if not exclusion_dict['exclude']:
        return 'i', exclusion_dict['include']
    else:
        return 'e', exclusion_dict['exclude']

while True:
    # Define Gemini prompt
    upper_description = "\n".join(
        [f"{item['id']}. {item['description']}" for item in upper_body_items if item['id'] not in exclusion_list])
    lower_description = "\n".join(
        [f"{item['id']}. {item['description']}" for item in lower_body_items if item['id'] not in exclusion_list])
    preferences = "\n".join(
        [item for item in inclusion_list]
    )
    prompt = f"""
    Act as an experienced fashion designer with great taste in selecting clothes and very good fashion sense.
    The user has the following preferences and tastes:
    no specific taste
    {preferences}
    
    The weather today is:
    Sunny, 31 degrees.
    
    The occasion for the user is:
    casual party tonight
    
    The following are the descriptions of the upper body garments the user has in their wardrobe:
    {upper_description}
    
    The following are the descriptions of the lower body garments the user has in their wardrobe:
    {lower_description}
    
    Using the user preferences, weather conditions, and occasion for the user, select one upper body garment and one lower body garment most suitable.
    
    Just give me the number of the upper body garment and lower body garment that you select.
    """

    print(prompt)
    # Call Gemini API
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)
    suggestion = response.text.strip()
    print(suggestion)
    print("Do you have a suggestion or are you ok with this outfit?")
    feedback = input()
    if any(word in ["ok", "good", "perfect"] for word in feedback.split()):
        break
    action, lst = exclude_from_list(feedback)
    print(action)
    if action == 'i':
        inclusion_list = lst
    else:
        exclusion_list = lst
        exclusion_list = [int(item) for item in exclusion_list]


print(suggestion)
