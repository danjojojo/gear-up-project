import React, { useRef, useState } from 'react';
import upload from '../../assets/icons/upload.png';
import './img-upload-button.scss';
import CropModal from '../crop-modal/crop-modal';
import { centerCrop, makeAspectCrop } from 'react-image-crop';

function ImageUploadButton({ onFileSelect, part }) {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState('');

    const ASPECT_RATIO = 1;
    
    let MIN_WIDTH = 150;
    let MIN_HEIGHT = 50;

    switch (part) {
        case 'frame':
            MIN_WIDTH = 305;
            MIN_HEIGHT = 200;
            break;
        case 'fork':
            MIN_WIDTH = 35;
            MIN_HEIGHT = 200;
            break;
        case 'groupset':
            MIN_WIDTH = 220;
            MIN_HEIGHT = 90;
            break;
        case 'wheelset':
            MIN_WIDTH = 225;
            MIN_HEIGHT = 225;
            break;
        case 'seat':
            MIN_WIDTH = 116;
            MIN_HEIGHT = 90;
            break;
        case 'cockpit':
            MIN_WIDTH = 46;
            MIN_HEIGHT = 39;
            break;
        default:
            MIN_WIDTH = 150;
            MIN_HEIGHT = 50;
            break;
    }

    const [showCropModal, setShowCropModal] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        console.log(imgSrc);
        const file = event.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            console.log('Show modal');
            const imageElement = new Image();
            const imageUrl = reader.result.toString() || "";
            imageElement.src = imageUrl;

            // imageElement.addEventListener('load', () => {
            //     if(error) setError("");
            //     const { naturalWidth, naturalHeight } = imageElement;
            //     if (naturalWidth <= MIN_WIDTH || naturalHeight <= MIN_HEIGHT) {
            //         setError(`Image must be at least ${MIN_WIDTH}x${MIN_HEIGHT}`);
            //         alert(`Image must be at least ${MIN_WIDTH}x${MIN_HEIGHT}`);
            //         return setImgSrc("");
            //     }
            // });
            setImgSrc("");
            setTimeout(() => {
                setShowCropModal(true);
                // console.log(imageUrl);
                setImgSrc(imageUrl);
            }, 0);
        });
        reader.readAsDataURL(file);
        event.target.value = null;
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const cropWidthPercent = MIN_WIDTH / width * 100;
        const crop = makeAspectCrop(
            {
                unit: '%',
                width: cropWidthPercent
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <div className='upload-container d-flex justify-content-center align-items-center'>
                <button
                    type="button"
                    onClick={handleClick}
                    style={{
                        backgroundImage: `url(${backgroundImage})`, // Set background image
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
            {imgSrc && 
                <CropModal 
                    show={showCropModal}
                    onHide={() => setShowCropModal(false)}
                    imgSrc={imgSrc} 
                    crop={crop} 
                    setCrop={setCrop}
                    error={error}
                    minimumWidth={MIN_WIDTH}
                    minimumHeight={MIN_HEIGHT}
                    onImageLoad={onImageLoad}
                    setBackgroundImage={setBackgroundImage}
                    setSelectedFile={setSelectedFile}
                    onFileSelect={onFileSelect}
                    part={part}
                />
            }
        </>
    );
}

export default ImageUploadButton;