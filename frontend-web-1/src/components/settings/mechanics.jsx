import React, { useState, useEffect } from 'react'
import {
    getSettings,
    setMechanicPercentage
} from '../../services/settingsService';
import ResponseModal from '../response-modal/response-modal';

const Mechanics = () => {
    
    const [currentMechanicPercentage, setCurrentMechanicPercentage] = useState(0);

    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const [errorClass, setErrorClass] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleGetMechanicPercentage = async () => {
        try {
            const { settings } = await getSettings();
            console.log(settings);
            let retrievedMechanicPercentage = settings.filter(setting => setting.setting_key === 'mechanic_percentage');
            console.log(retrievedMechanicPercentage[0]);
            setCurrentMechanicPercentage(Number(retrievedMechanicPercentage[0].setting_value));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleGetMechanicPercentage();
    }, []);

    const handleSetMechanicPercentage = async () => {
        if(currentMechanicPercentage <= 0 || currentMechanicPercentage > 100) {
            setErrorMessage('Percentage must be between 1 and 100.');
            setErrorClass('error');
            return;
        }

        console.log(currentMechanicPercentage);
        try {
            await setMechanicPercentage(currentMechanicPercentage);
            setErrorMessage('');
            setErrorClass('');
            setResponseMessage('Mechanic percentage updated successfully.');
            setShowResponseModal(true);
        } catch (error) {
            setResponseMessage('Updating mechanic percentage failed.');
            setShowResponseModal(true);
            console.error(error);
        }
    }

    return (
        <div>
            <ResponseModal 
                show={showResponseModal}
                message={responseMessage}
                onHide={() => setShowResponseModal(false)}
            />
            <div className='form-groups'>
                <div className="form-group">
                    {/* <div className='label-edit'>
                    <label htmlFor="name">Name</label>
                    <p>Edit</p>
                    </div> */}
                    <label htmlFor="name">Mechanic Earning from Sales (in Percentage)</label>
                    <p>Set how much should mechanics earn from their service rendered.</p>
                    <p><em>You have set <b>{currentMechanicPercentage}%</b>. If a mechanic charges ₱500 for the service, they will earn ₱{500 * Number(currentMechanicPercentage) / 100}. </em></p>
                    <input type="number" value={currentMechanicPercentage} onChange={(e) => setCurrentMechanicPercentage(Number(e.target.value))} className={errorClass}
                     max={100} placeholder='1%-100%'/>
                    
                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    <button onClick={handleSetMechanicPercentage}>Save changes</button>
                </div>
            </div>
        </div>
    )
}

export default Mechanics