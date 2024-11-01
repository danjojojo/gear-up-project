function compressBase64Image(base64, maxWidth, maxHeight, quality = 0.7) {
    return new Promise((resolve) => {
        // Create a new image element
        const img = new Image();
        img.src = base64;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            // Set canvas dimensions to new dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw the image on the canvas with new dimensions
            ctx.drawImage(img, 0, 0, width, height);

            // Get the new compressed base64 image from canvas
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };
    });
}

export default compressBase64Image;