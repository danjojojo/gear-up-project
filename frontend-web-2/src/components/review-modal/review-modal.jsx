import React, { useState, useRef, useEffect } from 'react'
import './review-modal.scss'
import {Modal, Button} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import {
    submitReview
} from '../../services/userService';
import moment from 'moment';

function ReviewModal({ 
    itemId,
    itemName,
    itemPicture,
    itemDescription,
    onConfirm,
    onHide,
    setShowReviewModal,
    submittedReviewRating,
    submittedReviewText,
    submittedReviewImage,
    submittedReviewId,
    submittedReviewDate,
    ...props
}) {
    const starsCount = 5;

    const [reviewRating, setReviewRating] = useState(1);
    const [reviewText, setReviewText] = useState('');

    const imageInputRef = useRef(null);

    const [error, setError] = useState('');
    const [reviewTextError, setReviewTextError] = useState('');
    const [reviewImage, setReviewImage] = useState(null);
    const [reviewPreviewImage, setReviewPreviewImage] = useState(null);

    const handleRating = (value) => {
        setReviewRating(value);
    }

    const ratingText = (rating) => {
        switch(rating){
            case 1:
                return 'Poor';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
                return 'Very Good';
            case 5:
                return 'Excellent';
            default:
                return 'Rating';
        }
    }

    useEffect(() => {
        setReviewRating(1);
        setReviewText('');
        setReviewImage(null);
    },[itemId]);

    const handleSubmitReview = async (event) => {
        if(reviewText === ''){
            setReviewTextError('Please write a review.');
            return;
        }
        event.preventDefault();
        const formData = new FormData();
        formData.append('itemId', itemId);
        formData.append('reviewRating', reviewRating);
        formData.append('reviewText', reviewText);
        if(reviewImage) formData.append('reviewImage', reviewImage);

        try {
            await submitReview(formData);
            setShowReviewModal(false);
        } catch (error) {
            console.error(error);
        }
    }

    function imageUpload(){
		imageInputRef.current.click();
	}

    function handleImageChange(e) {
		const image = e.target.files[0]
		
		if(image){
			if(!image.type.startsWith("image/")) {
				e.target.value = "";
				setError("Please upload an image file.");
				return;
			}
			
			if(image.type === "image/gif"){
				e.target.value = "";
				setError("Please upload an image in JPEG and PNG formats only.");
				return;
			}

            setReviewImage(image)
            setReviewPreviewImage(URL.createObjectURL(image))
			setError(null);
		}
	}

    function removeImage(){
        setReviewImage(null);
        setReviewPreviewImage(null);
        imageInputRef.current.value = null;
    }

    return (
        <Modal
        show={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName='review-modal'
        centered
        {...props}
        >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
            Review Item
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='item-details'>
                <img src={`data:image//png;base64, ${itemPicture}`} alt={itemName}/>
                <div className='name-desc'>
                    <h4>{itemName}</h4>
                    <p>{itemDescription}</p>
                </div>
            </div>
            {!submittedReviewId && 
                <form>
                    <div className='rating'>
                        <p>How satisfied are you with your order?</p>
                        <div>
                            <Rating
                                onClick={handleRating}
                                ratingValue={reviewRating}
                                initialValue={reviewRating}
                                iconsCount={starsCount}
                                size={30}
                                fillColor='#F9961F'
                                emptyColor='#CCC'
                            />
                            <p className='rating-text'>{ratingText(reviewRating)}</p>
                        </div>
                    </div>
                    <h6>Write Your Review</h6>
                    <textarea name="" id="" placeholder='Would you like to write anything about this product?' onChange={(e) => setReviewText(e.target.value)} value={reviewText}></textarea>
                    {reviewTextError && <p className='error'>{reviewTextError}</p>}
                    <div className="image-input">
                        <h6>Add Photo</h6>
                        <input 
                            type="file" 
                            accept='image/*' 
                            onChange={handleImageChange}
                            ref={imageInputRef}
                            style={{display: 'none'}}
                        />

                        {!reviewImage && <div onClick={imageUpload} className='upload-image'>
                            <i className="fa-regular fa-image"></i>
                            <p className='title'>Upload image</p>
                        </div>}
                        {reviewImage && 
                            <div className='img-preview'>
                                <img src={reviewPreviewImage} alt=""/>
                                <button className="remove-img" onClick={removeImage}>Remove image</button>
                            </div>
                        }
                        {error && <p className='error'>{error}</p>}
                    </div>
                </form>
            }
            {submittedReviewId && 
                <>
                    <p className='review-date'>Submitted on {moment(submittedReviewDate).format('LLL')}</p>
                    <div className='rating'>
                        <h6>Your Rating</h6>
                        <Rating
                            ratingValue={submittedReviewRating}
                            initialValue={submittedReviewRating}
                            readonly={true}
                            size={30}
                            fillColor='#F9961F'
                            emptyColor='#CCC'
                        />
                    </div>
                    <h6>Your Review</h6>
                    <p className='review-text'>{submittedReviewText}</p>
                    {submittedReviewImage && <div className="image-input">
                        <h6>Attached Image</h6>
                        <div className="img-preview">
                            <img src={`data:image//png;base64, ${submittedReviewImage}`} alt=""/>
                        </div>
                    </div>}
                </>
            }
        </Modal.Body>
        <Modal.Footer>
            {!submittedReviewId && <Button
                onClick={handleSubmitReview}
            >Submit Review</Button>}
            <Button
                variant='secondary'
                onClick={() => onHide()}
            >Close</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default ReviewModal;