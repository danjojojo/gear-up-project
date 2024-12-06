import React, { useState, useEffect } from 'react';
import {
    getSettings,
    setDisplayStockLevelPOS
} from '../../services/settingsService';
import ResponseModal from '../response-modal/response-modal';

const Pos = () => {

    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const [currentDisplayValue, setCurrentDisplayValue] = useState(false);
    const [newDisplayValue, setNewDisplayValue] = useState(false);

    const getSettingsData = async () => {
        try {
            const { settings } = await getSettings();
            let retrievedValue = settings.filter(setting => setting.setting_key === 'display_stock_level_pos');
            setCurrentDisplayValue(retrievedValue[0].setting_value);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSetDisplayStockLevelPOS = async () => {
        try {
            let newDisplayValueString = newDisplayValue ? 'yes' : 'no';
            await setDisplayStockLevelPOS(newDisplayValueString);
            setResponseMessage('Display stock level for POS items updated successfully.');
            setShowResponseModal(true);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getSettingsData();
    }, [])

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
                    <div className="switch form-check form-switch">
                        <label htmlFor="">Display current stock level for POS Items</label>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="lowStock"
                            name="lowStockAlert"
                            checked={currentDisplayValue === 'yes'}
                            onChange={(e) => {
                                setCurrentDisplayValue(e.target.checked ? 'yes' : 'no');
                                setNewDisplayValue(e.target.checked);
                            }}
                        />
                    </div>
                    
                    <button onClick={handleSetDisplayStockLevelPOS}>Save changes</button>
                </div>
            </div>
        </div>
    )
}

export default Pos