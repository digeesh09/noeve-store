import sys
from PIL import Image

def recolor_image(image_path, target_color_hex):
    # Convert hex to RGB tuple
    target_color_hex = target_color_hex.lstrip('#')
    target_r = int(target_color_hex[0:2], 16)
    target_g = int(target_color_hex[2:4], 16)
    target_b = int(target_color_hex[4:6], 16)

    # Open image and convert to RGBA
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Keep original alpha, replace RGB
        # item is (R, G, B, A)
        new_data.append((target_r, target_g, target_b, item[3]))
        
    img.putdata(new_data)
    img.save(image_path)
    print("Recolored successfully.")

if __name__ == "__main__":
    recolor_image("logo.png", "#6B2230")
