import React, {useRef, useState} from 'react'
import './crop-modal.scss'
import { Modal, Button } from 'react-bootstrap'; // Assuming you're using Bootstrap
import ReactCrop, { convertToPixelCrop } from 'react-image-crop';
import setCanvasPreview from '../../utility/setCanvasPreview';

const CropModal = ({ show, onHide, imgSrc, error, crop, setCrop, minimumWidth, minimumHeight, onImageLoad, setBackgroundImage, setSelectedFile, onFileSelect, part }) => {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const dataURLtoFile = (dataUrl, filename) => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };
  return (
    <Modal show={show} centered size="lg" contentClassName='crop-modal'>
        <Modal.Header>
            Crop Image      
        </Modal.Header>
        <Modal.Body>
            <div className="content">
                {error && <p className="error">{error}</p>}
                <ReactCrop 
                    crop={crop}
                    keepSelection
                    minWidth={minimumWidth}
                    minHeight={minimumHeight}
                    onChange={(percentCrop) => {
                        setCrop(percentCrop)
                    }}
                >
                    <img 
                        ref={imgRef}
                        src={imgSrc} 
                        alt="Crop" 
                        onLoad={onImageLoad} 
                    />
                </ReactCrop>
                <div className="btns">
                    <Button variant='primary' onClick={() => {
                            // Crop the image
                            setCanvasPreview(
                                imgRef.current,
                                previewCanvasRef.current,
                                convertToPixelCrop(
                                    crop,
                                    imgRef.current.width,
                                    imgRef.current.height
                                )
                            ); 
                            const dataUrl = previewCanvasRef.current.toDataURL();
                            const croppedFile = dataURLtoFile(dataUrl, 'cropped-image.png');
                            setBackgroundImage(dataUrl);
                            setSelectedFile(croppedFile);
                            if (typeof onFileSelect === 'function') {
                                onFileSelect(croppedFile); // Notify parent about the selected file
                            }
                            onHide();
                    }}>
                        Crop
                    </Button>
                    <Button variant='secondary' onClick={() => {
                            onHide();
                        }}>
                        Cancel
                    </Button>
                </div>
            </div>
            {crop &&
                <canvas
                    ref={previewCanvasRef}
                    style={{
                        display: 'none',
                        border: '1px solid #000',
                        width: imgRef.width || '100%',
                        height: '50vh',
                        objectFit: 'contain',
                        // margin:'5px auto' 
                    }}
                />
            }
        </Modal.Body>
    </Modal>
  )
}

export default CropModal;