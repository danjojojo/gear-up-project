import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './bike-builder-upgrader.scss';
import edit from "../../assets/icons/edit.png";
import mountain from "../../assets/images/mountain.png";
import road from "../../assets/images/road.png";
import ResponsivePageLayout from '../../components/responsive-page-layout/responsive-page-layout';
import LoadingPage from '../../components/loading-page/loading-page';
import { getBikeTypes } from '../../services/bbuService';
import BikeTypeModal from '../../components/bike-type-modal/bike-type-modal';
import { AuthContext } from '../../context/auth-context';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const BikeBuilderUpgrader = () => {
    const navigate = useNavigate();
    const { userRole } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 1000);

    const handlePartClick = (part) => {
        navigate(`${part}`);
    };

    const [isVisible, setIsVisible] = useState(true);
    const [rightContainerStyle, setRightContainerStyle] = useState("right-container");
    const [originalHeight, setOriginalHeight] = useState(window.innerHeight);

    const [isEditing, setIsEditing] = useState(false);

    const [retrievedBikeTypes, setRetrievedBikeTypes] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState("add");
    const [bikeType, setBikeType] = useState({});
    const [error, setError] = useState('');

    const handleResize = () => {
        const isKeyboardOpen = window.innerHeight < originalHeight; // Check if keyboard is open
        if (!isKeyboardOpen) {
            if (window.innerWidth < 900) {
                setRightContainerStyle("right-container-close");
                setIsVisible(true);
            } else {
                setRightContainerStyle("right-container");
                setIsVisible(true);
            }
        }
    }

    useEffect(() => {
        handleResize();

        setOriginalHeight(window.innerHeight); // Store original height on mount
        const handleResizeDebounced = debounce(handleResize, 100);

        // Setup resize listener only if width is greater than 900
        const checkWindowSizeAndAddListener = () => {
            if (window.innerWidth > 900) {
                window.addEventListener("resize", handleResizeDebounced);
            }
        };

        checkWindowSizeAndAddListener(); // Check size and possibly add listener

        return () => {
            window.removeEventListener("resize", handleResizeDebounced);
        };
    }, []);

    const handleGetBikeTypes = async () => {
        try {
            const { bikeTypes } = await getBikeTypes();
            setRetrievedBikeTypes(bikeTypes);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleGetBikeTypes();
    },[]);

    const handleAddBikeType = () => {
        setAction("Add");
        setShowModal(true);
        setError('');
    }

    const handleDeleteBikeType = (type) => {
        setAction("Delete");
        setBikeType(type);
        setShowModal(true);
        setError('');
    }

    const handleEditBikeType = (type) => {
        setAction("Edit");
        setBikeType(type);
        setShowModal(true);
        setError('');
    }

    if (loading) return <LoadingPage classStyle={"loading-in-page"} />

    return (
        <div className='bike-builder-upgrader p-3'>
            <ResponsivePageLayout
                rightContainer={rightContainerStyle}
                leftContent={
                    <div className='bike-builder-upgrader-container'>
                        <BikeTypeModal
                            show={showModal}
                            onHide={() => setShowModal(false)}
                            action={action}
                            bikeType={bikeType}
                            setShowModal={setShowModal}
                            handleGetBikeTypes={handleGetBikeTypes}
                            retrievedBikeTypes={retrievedBikeTypes}
                            error={error}
                            setError={setError}
                        />
                        {retrievedBikeTypes.map((bikeType, index) => (
                            <div
                                key={index}
                                className='part-container'
                                onClick={() => handlePartClick(bikeType.bike_type_tag)}
                            >
                                <div className='content'>
                                    <div className='image'>
                                        <img 
                                            src={`data:image//png;base64, ${bikeType.bike_type_image}`} 
                                            alt={bikeType.bike_type_name}
                                            // onError={(e) => (e.target.src = mountain)}
                                        />
                                    </div>
                                    <div className='part-item-count'>
                                        <div className='part'>{bikeType.bike_type_name}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
                rightContent={
                    <div className='bike-types'>
                        {userRole === 'admin' && 
                            <>
                                <div className="nav">
                                    <h4>Bike Types</h4>
                                    <div className="btns">
                                        <i 
                                            className="fa-solid fa-plus"
                                            onClick={handleAddBikeType}
                                        ></i>
                                    </div>
                                </div>
                                <div className="types">
                                    {retrievedBikeTypes.map((bikeType, index) => (
                                        <div key={index} className='type'>
                                            <p>{bikeType.bike_type_name}</p>

                                            <div className='types-buttons'>
                                                <i 
                                                    className="fa-regular fa-pen-to-square"
                                                    onClick={() => handleEditBikeType(bikeType)}
                                                ></i>
                                                {bikeType.bike_type_tag !== 'mtb' && 
                                                    <i 
                                                        className="fa-regular fa-trash-can"
                                                        onClick={() => handleDeleteBikeType(bikeType)}
                                                    ></i>
                                                }     
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                    </div>
                }
            />
        </div>
    );
};

export default BikeBuilderUpgrader;
