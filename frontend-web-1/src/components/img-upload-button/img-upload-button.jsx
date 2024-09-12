import React, { useRef, useState } from 'react';
import upload from '../../assets/icons/upload.png';
import "./img-upload-button.scss"

function ImageUploadButton() {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        console.log("Selected file:", file);

    };


    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='upload-container d-flex justify-content-center align-items-center'>
            <button onClick={handleClick}>
                <img src={upload} alt='Filter' className='button-icon' />

                <p className='m-0'>
                    {selectedFile ? `${selectedFile.name}` : 'Upload Image'}
                </p>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                accept=".jpg, .jpeg, .png"
                style={{ display: 'none' }}  // Hide the file input
                onChange={handleFileChange}
            />
        </div>
    );
}

export default ImageUploadButton;