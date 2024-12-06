import React, { useState, useEffect } from 'react';
import {
    getSettings,
    setDisplayExpenses
} from '../../services/settingsService';
import ResponseModal from '../response-modal/response-modal';

const Expenses = () => {

    const [currentDisplayValue, setCurrentDisplayValue] = useState(false);
    const [newDisplayValue, setNewDisplayValue] = useState(false);

    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const getSettingsData =  async() => {
        try {
            const { settings } = await getSettings();
            let retrievedCurrentValue = settings.filter(setting => setting.setting_key === 'display_expenses');
            setCurrentDisplayValue(retrievedCurrentValue[0].setting_value);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getSettingsData();
    }, []);

    const handleSetDisplayExpenses = async () => {
        try {
            let newDisplayValueString = newDisplayValue ? 'yes' : 'no';
            await setDisplayExpenses(newDisplayValueString);
            setResponseMessage('Display expenses updated successfully.');
            setShowResponseModal(true);
        } catch (error) {
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
                <div className="switch form-check form-switch">
                    <label htmlFor="">Enable tracking Expenses</label>
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
                <p><em>Enabling this will allow the following:</em></p>
                <em>
                    <ul>
                        <li>Display Expenses page for POS Users.</li>
                        <li>Display Expenses tab in your Records page.</li>
                        <li>Allow to see expense amount in Summaries and Dashboard.</li>
                        <li>Allow to see monthly expense reports in Reports page.</li>
                    </ul>
                </em>
                
                <button onClick={handleSetDisplayExpenses}>Save changes</button>
            </div>
        </div>
    </div>
  )
}

export default Expenses