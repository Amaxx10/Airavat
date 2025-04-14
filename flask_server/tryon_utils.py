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

def process_virtual_tryon(person_image, cloth_image):
    # Save the uploaded images to temporary files
    person_image_path = "temp_person_image.jpg"
    cloth_image_path = "temp_cloth_image.jpg"
    with open(person_image_path, "wb") as f:
        f.write(person_image.read())
    with open(cloth_image_path, "wb") as f:
        f.write(cloth_image.read())

    driver = setup_chrome_driver()
    download_folder = r"images"  # Output folder for results
    os.makedirs(download_folder, exist_ok=True)
    
    try:
        print("Opening Hugging Face Space...")
        driver.get("https://huggingface.co/spaces/Kwai-Kolors/Kolors-Virtual-Try-On")
        time.sleep(5)

        # Switch to iframe
        iframe = driver.find_element(By.CSS_SELECTOR, "iframe[src*='hf.space']")
        driver.switch_to.frame(iframe)

        # Upload person image using local path
        person_component = driver.find_element(By.ID, "component-11")
        person_input = person_component.find_element(By.CSS_SELECTOR, "input[type='file']")
        person_input.send_keys(os.path.abspath(person_image_path))

        time.sleep(2)

        # Upload cloth image using local path
        cloth_component = driver.find_element(By.ID, "component-14")
        cloth_input = cloth_component.find_element(By.CSS_SELECTOR, "input[type='file']")
        cloth_input.send_keys(os.path.abspath(cloth_image_path))

        # Wait for processing to start
        print("Waiting for processing...")
        time.sleep(5)

        # Try to find and click submit button if exists
        try:
            buttons = driver.find_elements(By.TAG_NAME, "button")
            submit_clicked = False

            for button in buttons:
                if button.is_displayed() and any(
                        keyword in button.text.lower() for keyword in ["run", "submit", "generate", "try on"]):
                    print(f"Clicking button: {button.text}")
                    button.click()
                    submit_clicked = True
                    break

            if not submit_clicked:
                print("No explicit submit button found, proceeding with automatic processing")
        except:
            print("Error finding/clicking submit button, proceeding anyway")

        # Wait for results
        print("Waiting for results...")
        time.sleep(20)  # Adjust based on how long processing takes

        # Find output image(s)
        print("Looking for output images...")

        # Try different strategies to find the output image
        # 1. Look for images in output components (higher numbers are usually outputs)
        output_images = []

        # Method 1: First check component-19 and higher (output components are usually higher numbered)
        for i in range(19, 30):
            try:
                component = driver.find_element(By.ID, f"component-{i}")
                images = component.find_elements(By.TAG_NAME, "img")
                if images:
                    output_images.extend(images)
                    print(f"Found {len(images)} images in component-{i}")
            except:
                pass

        # Method 2: If no images found, look for all images
        if not output_images:
            try:
                output_images = driver.find_elements(By.TAG_NAME, "img")
                print(f"Found {len(output_images)} images in total")
            except:
                print("No images found")

        # Filter out empty images and small thumbnails
        valid_images = []
        for img in output_images:
            try:
                src = img.get_attribute("src")
                if src and not src.endswith('svg') and not src.endswith('placeholder'):
                    # Try to get image size
                    width = img.get_attribute("width")
                    height = img.get_attribute("height")
                    # Assume larger images are output
                    if not width or not height or int(width) > 100:
                        valid_images.append(img)
            except:
                pass

        print(f"Found {len(valid_images)} valid output images")

        # Download images
        download_count = 0
        for i, img in enumerate(valid_images):
            try:
                # Get image source
                src = img.get_attribute("src")

                if not src:
                    continue

                print(f"Processing image {i + 1} with source type: {src[:30]}...")

                # Create a filename for the downloaded image
                filename = f"result_image_{i + 1}.png"
                filepath = os.path.join(download_folder, filename)

                # Handle different types of image sources
                if src.startswith("data:image"):
                    # Handle base64 encoded images
                    img_data = src.split(",")[1]
                    with open(filepath, "wb") as f:
                        f.write(base64.b64decode(img_data))
                elif src.startswith("http"):
                    # Handle remote images
                    response = requests.get(src)
                    with open(filepath, "wb") as f:
                        f.write(response.content)
                elif src.startswith("file"):
                    # Handle local file references
                    parsed_url = urlparse(src)
                    local_path = parsed_url.path
                    if os.path.exists(local_path):
                        with open(filepath, "wb") as f:
                            with open(local_path, "rb") as source:
                                f.write(source.read())
                else:
                    # For other types, try to download via JavaScript
                    driver.execute_script("""
                        var link = document.createElement('a');
                        link.href = arguments[0];
                        link.download = 'download.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    """, src)
                    time.sleep(1)
                    continue

                print(f"Downloaded image to: {filepath}")
                download_count += 1

            except Exception as e:
                print(f"Error downloading image {i + 1}: {str(e)}")

        if download_count == 0:
            print("No images were downloaded. Let's try an alternative method.")

            # Try to find download buttons
            download_buttons = driver.find_elements(By.CSS_SELECTOR,
                                        "button[download], a[download], button:has(svg[stroke='download']), button[aria-label*='download']")

            if download_buttons:
                print(f"Found {len(download_buttons)} download buttons")
                for i, button in enumerate(download_buttons):
                    try:
                        print(f"Clicking download button {i + 1}")
                        button.click()
                        time.sleep(2)
                    except Exception as e:
                        print(f"Error clicking download button: {str(e)}")
            else:
                print("No download buttons found")

                # Last resort: Take a screenshot of the result area
                try:
                    print("Taking screenshot of results...")
                    # Try to find the output component
                    for i in range(19, 25):
                        try:
                            output_component = driver.find_element(By.ID, f"component-{i}")
                            screenshot_path = os.path.join(download_folder, "result_screenshot.png")
                            output_component.screenshot(screenshot_path)
                            print(f"Saved screenshot to: {screenshot_path}")
                            break
                        except:
                            pass
                except Exception as e:
                    print(f"Error taking screenshot: {str(e)}")

        print(f"Completed. Downloaded {download_count} images.")

        # Return the first valid result image found
        for img in valid_images:
            try:
                src = img.get_attribute("src")
                if src and src.startswith('data:image'):
                    img_data = src.split(",")[1]
                    return base64.b64decode(img_data)  # Return image as bytes
            except:
                continue
                
        raise Exception("Could not find valid result image")

    except Exception as e:
        print(f"Virtual try-on error: {str(e)}")
        raise e
    finally:
        driver.quit()