import os

img_dir = "c:\\TedXkare\\frontend\\public\\images\\team"
files = os.listdir(img_dir)

large_images = {}
for file in files:
    if not file.startswith("extracted_p"):
        continue
    path = os.path.join(img_dir, file)
    size = os.path.getsize(path)
    
    # Filter out tiny icon decorations, dots, lines (< 20KB)
    if size > 15000:
        parts = file.split("_")
        page = parts[1] # e.g. "p2"
        if page not in large_images:
            large_images[page] = []
        large_images[page].append((file, size))

# Print sorted large images per page
for page in sorted(large_images.keys(), key=lambda x: int(x[1:])):
    print(f"\n--- {page.upper()} ---")
    for file, size in sorted(large_images[page], key=lambda x: x[1], reverse=True):
         print(f"{file}: {size / 1024:.1f} KB")
