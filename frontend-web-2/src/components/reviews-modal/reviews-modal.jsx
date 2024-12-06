import React, {useEffect, useState} from 'react'
import { Modal } from 'react-bootstrap';
import { getItemReviews } from '../../services/bikeBuilderService';
import { Rating } from 'react-simple-star-rating';
import './reviews-modal.scss';

const ReviewsModal = ({ 
    item,
    reviewsCount,
    ...props
}) => {
    
    const [retrievedReviews, setRetrievedReviews] = useState([]);

    const [showImage, setShowImage] = useState(false);
    const [image, setImage] = useState();

    const fetchReviews = async () => {
        try {
            const { reviews } = await getItemReviews(item.item_id);
            setRetrievedReviews(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }
    useEffect(() => {
        fetchReviews();
    },[]);

    const modalBodyStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    }

    const ViewImage = ({ ...props}) => {
        return (
            <Modal
                show={true}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                {...props}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Image
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={modalBodyStyle}>
                    <img src={`data:image//png;base64, ${image}`} alt="Review" style={{ height: '70vh'}}/>
                </Modal.Body>
            </Modal>
        )
    }

    const handleViewImage = (reviewImage) => {
        setShowImage(true);
        setImage(reviewImage);
    }

    return (
        <>
            <ViewImage 
                show={showImage}
                onHide={() => {
                    setShowImage(false)
                }}
            />
            <Modal
                show={true}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='reviews-modal'
                centered
                {...props}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                    {item.item_name} Reviews ({reviewsCount})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="review-container">
                        {retrievedReviews.map((review, index) => (
                            <div key={index} className="review">
                                <div className="review-header">
                                    <div className="review-user">
                                        <img src={review.profile_picture} alt="profile" />
                                        <p>{review.name}</p>
                                    </div>
                                    <div className="review-rating">
                                        <Rating
                                            readonly={true}
                                            initialValue={review.rating}
                                            allowFraction={true}
                                            size={20}
                                            fillColor='#F9961F'
                                            emptyColor='#CCC'
                                        />
                                    </div>
                                </div>
                                <div className="review-comment">
                                    <p>{review.comment}</p>
                                </div>
                                {review.review_image && (
                                    <div className="review-image">
                                        <img src={`data:image//png;base64, ${review.review_image}`} alt="Review" onClick={() => handleViewImage(review.review_image)}/>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ReviewsModal;