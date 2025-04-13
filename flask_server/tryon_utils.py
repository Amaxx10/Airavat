from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import base64
import os
import time
from PIL import Image
import io
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def setup_chrome_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    chrome_driver_path = r"E:\chromedriver-win64\chromedriver-win64\chromedriver.exe"
    return webdriver.Chrome(service=Service(chrome_driver_path), options=chrome_options)

def process_virtual_tryon(person_image_bytes, cloth_image_bytes):
    temp_dir = "temp_images"
    os.makedirs(temp_dir, exist_ok=True)
    
    person_path = os.path.join(temp_dir, "person.jpg")
    cloth_path = os.path.join(temp_dir, "cloth.jpg")
    
    # Save images with explicit RGB conversion
    Image.open(io.BytesIO(person_image_bytes)).convert('RGB').save(person_path)
    Image.open(io.BytesIO(cloth_image_bytes)).convert('RGB').save(cloth_path)
    
    driver = setup_chrome_driver()
    wait = WebDriverWait(driver, 30)
    result_image = None

    try:
        print("Opening Hugging Face Space...")
        driver.get("https://huggingface.co/spaces/Kwai-Kolors/Kolors-Virtual-Try-On")
        time.sleep(5)  # Initial load wait

        # Switch to iframe with explicit wait
        iframe = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "iframe[src*='hf.space']")))
        driver.switch_to.frame(iframe)
        print("Successfully switched to iframe")

        # Upload person image with explicit wait
        person_component = wait.until(EC.presence_of_element_located((By.ID, "component-11")))
        person_input = person_component.find_element(By.CSS_SELECTOR, "input[type='file']")
        print("Uploading person image...")
        person_input.send_keys(os.path.abspath(person_path))
        time.sleep(3)  # Wait for upload

        # Upload garment image
        garment_component = wait.until(EC.presence_of_element_located((By.ID, "component-14")))
        garment_input = garment_component.find_element(By.CSS_SELECTOR, "input[type='file']")
        print("Uploading garment image...")
        garment_input.send_keys(os.path.abspath(cloth_path))
        
        # Wait for processing
        print("Waiting for processing...")
        time.sleep(20)  # Extended wait for processing

        # Try multiple methods to find the result image
        output_images = []
        
        # Method 1: Check specific components
        for i in range(19, 30):
            try:
                component = wait.until(EC.presence_of_element_located((By.ID, f"component-{i}")))
                images = component.find_elements(By.TAG_NAME, "img")
                output_images.extend(images)
                print(f"Found {len(images)} images in component-{i}")
            except:
                continue

        # Method 2: Check all images if needed
        if not output_images:
            try:
                output_images = driver.find_elements(By.TAG_NAME, "img")
                print(f"Found {len(output_images)} total images")
            except:
                print("No images found through general search")

        # Process found images
        for img in output_images:
            try:
                src = img.get_attribute("src")
                if src and src.startswith('data:image'):
                    # Verify image size/properties if possible
                    width = img.get_attribute("width")
                    height = img.get_attribute("height")
                    if not width or not height or int(width) > 100:  # Filter out thumbnails
                        result_base64 = src.split(",")[1]
                        result_image = base64.b64decode(result_base64)
                        print("Successfully captured result image")
                        break
            except Exception as e:
                print(f"Error processing image: {str(e)}")
                continue

        if not result_image:
            raise Exception("Could not find valid result image")

    except Exception as e:
        print(f"Virtual try-on error: {str(e)}")
        raise e
    
    finally:
        driver.quit()
        try:
            os.remove(person_path)
            os.remove(cloth_path)
        except:
            pass
        
    return result_image
