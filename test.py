import base64
from PIL import Image
import io

def image_to_base64(image_path):
    try:
        # Open the image file
        with Image.open(image_path) as img:
            # Convert to RGB if image is in RGBA
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            
            # Create a bytes buffer
            buffer = io.BytesIO()
            # Save image to buffer in JPEG format
            img.save(buffer, format='png')
            # Get the bytes from buffer
            img_bytes = buffer.getvalue()
            # Encode bytes to base64
            base64_string = base64.b64encode(img_bytes).decode('utf-8')
            return base64_string
    except Exception as e:
        print(f"Error converting image to base64: {e}")
        return None

def base64_to_image(base64_string, output_path):
    try:
        # Decode base64 string to bytes
        img_bytes = base64.b64decode(base64_string)
        # Create image from bytes
        img = Image.open(io.BytesIO(img_bytes))
        # Save image
        img.save(output_path)
        return True
    except Exception as e:
        print(f"Error converting base64 to image: {e}")
        return False

# Example usage
if __name__ == "__main__":
    # Convert image to base64
    image_path = "Test-Logo.svg.png"
    base64_data = image_to_base64(image_path)
    if base64_data:
        print("Base64 string:", base64_data[:50] + "...")
        
        # Convert back to image
        output_path = "output_image.png"
        if base64_to_image(base64_data, output_path):
            print(f"Image successfully saved to {output_path}")
