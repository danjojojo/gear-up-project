import React, {useEffect, useState} from 'react'
import {
    getBikeTypes
} from '../../../services/bikeBuilderService'
import { useNavigate, useParams } from 'react-router-dom';

const BikeTypes = ({
    isSelectingBikeType,
    setIsSelectingBikeType
}) => {
    const { typeTag } = useParams();
    const navigate = useNavigate();
    const [retrievedBikeTypes, setRetrievedBikeTypes] = useState([]);

    const handleSelectBikeType = (tag) => {
        if(!typeTag){
            navigate(`${tag}`)
        }
        setIsSelectingBikeType(false);
    }

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
    }, []);

    return (
        <div className='bike-types-container'>
            <div className="header">
                <h4>Select a Bike Type</h4>
            </div>
            <div className="types">
                {retrievedBikeTypes.map((bikeType, index) => (
                    <div className="type" key={index} onClick={() => handleSelectBikeType(bikeType.bike_type_tag)}>
                        <div className="image">
                            <img src={`data:image//png;base64, ${bikeType.bike_type_image}`}/>
                        </div>
                        <p>{bikeType.bike_type_name}</p>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default BikeTypes