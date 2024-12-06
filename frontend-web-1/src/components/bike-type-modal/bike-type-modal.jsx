import React, {useState, useRef} from 'react'
import './bike-type-modal.scss'
import { Modal, Button } from 'react-bootstrap'
import { addBikeType, editBikeType, deleteBikeType } from '../../services/bbuService'

const BikeTypeModal = ({ 
    action,
    bikeType,
    setShowModal,
    handleGetBikeTypes,
    retrievedBikeTypes,
    error,
    setError,
    ...props 
}) => {

    const bikeTypesArray = [
        'Mountain Bike',
        'Road Bike',
    ]

    const [newBikeTypeName, setNewBikeTypeName] = useState(bikeTypesArray[0]);

    const buttonVariant = action === 'Delete' ? 'danger' : 'primary';

    const handleAction = async (e) => {
        
        switch(action){
            case 'Add':
                e.preventDefault();
                let existingBikeType = retrievedBikeTypes.find((bikeType) => bikeType.bike_type_name === newBikeTypeName);
                if(existingBikeType){
                    setError('Bike type already exists');
                    return;
                }
                const addFormData = new FormData();
                addFormData.append('name', newBikeTypeName);
                addFormData.append('image', bikeTypeImage);
                await addBikeType(addFormData);
                break;
            case 'Edit':
                const editFormData = new FormData();
                editFormData.append('name', bikeType.bike_type_name);
                editFormData.append('image', bikeTypeImage);
                await editBikeType(bikeType.bike_type_id, editFormData);
                break;
            case 'Delete':
                await deleteBikeType(bikeType.bike_type_id);
                break;
            default:
                break;
        }
        setShowModal(false);
        setError('');
        setBikeTypeImage(null);
        setBikeTypePreviewImage(null);
        handleGetBikeTypes();
    }

    const imageInputRef = useRef(null);

    const [bikeTypeImage, setBikeTypeImage] = useState(null);
    const [bikeTypePreviewImage, setBikeTypePreviewImage] = useState(null);
    const [imageError, setImageError] = useState('');

    function handleImageChange(e) {
		const image = e.target.files[0]
		
		if(image){
			console.log(image)
			if(!image.type.startsWith("image/")) {
				e.target.value = "";
				setImageError("Please upload an image file.");
				return;
			}
			
			if(image.type === "image/gif"){
				e.target.value = "";
				setImageError("Please upload an image in JPEG and PNG formats only.");
				return;
			}

            setBikeTypeImage(image)
            setBikeTypePreviewImage(URL.createObjectURL(image))
			setImageError(null);
		}
	}

    function removeImage(){
        setBikeTypeImage(null);
        setBikeTypePreviewImage(null);
        imageInputRef.current.value = null;
    }

    function imageUpload(){
		imageInputRef.current.click();
	}

    return (
        <Modal
            show={true}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            contentClassName='bike-type-modal'
            centered
            {...props}
        >  
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action} Bike Type
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {action === 'Add' &&
                    <form>
                        <div className="form-groups">
                            <div className='form-group'>
                                <label htmlFor='bike-type'>Bike Type</label>
                                <select
                                    className='form-select'
                                    onChange={(e) => setNewBikeTypeName(e.target.value)}
                                    defaultValue=""
                                    required
                                >
                                    {bikeTypesArray.map((bikeType, index) => (
                                        <option key={index} value={bikeType}>
                                            {bikeType}
                                        </option>
                                    ))}
                                </select>
                                {error && <p className='error-msg'>{error}</p>}
                            </div>
                            <div className="image-input">
                                <h6>Add Wallpaper</h6>
                                <input 
                                    type="file" 
                                    accept='image/*' 
                                    onChange={handleImageChange}
                                    ref={imageInputRef}
                                    style={{display: 'none'}}
                                />

                                {!bikeTypeImage && <div onClick={imageUpload} className='upload-image'>
                                    <i className="fa-regular fa-image"></i>
                                    <p className='title'>Upload image</p>
                                </div>}
                                {bikeTypeImage && 
                                    <div className='img-preview'>
                                        <img src={bikeTypePreviewImage} alt=""/>
                                        <button className="remove-img" onClick={removeImage}>Remove image</button>
                                    </div>
                                }
                                {imageError && <p className='error-msg'>{imageError}</p>}
                            </div>
                        </div>
                    </form>
                }
                {action === 'Edit' &&
                    <form>
                        <div className="form-groups">
                            <div className='form-group'>
                                <label htmlFor='bike-type'>Bike Type</label>
                            <input 
                                type="text" 
                                value={bikeType.bike_type_name}
                                required
                                disabled
                                className='form-control'
                            />
                            </div>
                            <div className="image-input">
                                <div className="image-input">
                                    <h6>Wallpaper</h6>
                                    <input 
                                        type="file" 
                                        accept='image/*' 
                                        onChange={handleImageChange}
                                        ref={imageInputRef}
                                        style={{display: 'none'}}
                                    />
                                    {!bikeTypeImage && <div onClick={imageUpload} className='upload-image'>
                                        <i className="fa-regular fa-image"></i>
                                        <p className='title'>Upload image</p>
                                    </div>}
                                    {bikeTypeImage && 
                                        <div className='img-preview'>
                                            <img src={bikeTypePreviewImage} alt=""/>
                                            <button className="remove-img" onClick={removeImage}>Remove image</button>
                                        </div>
                                    }
                                    {imageError && <p className='error-msg'>{imageError}</p>}
                                </div>
                            </div>
                        </div>
                    </form>
                }
                {action === 'Delete' &&
                    <div className="form-groups">
                        <p>Are you sure you want to delete <b>{bikeType.bike_type_name}</b>? Parts added to {bikeType.bike_type_name} will be deleted as well. This cannot be undone.</p>
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant={buttonVariant} onClick={handleAction}>{action}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BikeTypeModal