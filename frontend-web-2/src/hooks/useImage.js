import { useEffect, useState } from 'react';

const useBase64Image = (imageData) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (imageData) {
            const img = new window.Image();
            img.src = `data:image/png;base64,${imageData}`;
            img.onload = () => setImage(img);
        } else {
            setImage(null); // Reset the image to null when imageData is not available
        }
    }, [imageData]);

    return image;
};

export default useBase64Image;