import React, { useRef, useState } from 'react';
import upload from '../../assets/icons/upload.png';
import './img-upload-button.scss';

function ImageUploadButton({ onFileSelect }) {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setBackgroundImage(URL.createObjectURL(file)); // Create a URL for the uploaded file
            if (typeof onFileSelect === 'function') {
                onFileSelect(file); // Notify parent about the selected file
            } else {
                console.error('onFileSelect is not a function');
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='upload-container d-flex justify-content-center align-items-center'>
            <button
                type="button"
                onClick={handleClick}
                style={{
                    backgroundImage: `url(${backgroundImage})`, // Set background image
                    backgroundSize: 'cover', // Cover the button area
                    backgroundPosition: 'center', // Center the image
                }}
                className={selectedFile ? 'image-upload-button with-image' : 'image-upload-button'}
            >
                {!selectedFile && <img src={upload} alt='Upload' className='button-icon' />}
                <p className='m-0'>
                    {selectedFile ? `${selectedFile.name}` : 'Upload Image'}
                </p>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                accept=".jpg, .jpeg, .png"
                style={{ display: 'none' }} // Hide the file input
                onChange={handleFileChange}
            />
        </div>
    );
}

export default ImageUploadButton;