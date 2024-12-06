import React, { useState, useEffect } from 'react'
// using settings.scss
import { 
    // gets
    getAdminSettings,
    getSettings,


    // sets
    setNewAdminName,
    setNewStoreName,
    setNewStoreAddress
} from '../../services/settingsService';
import ResponseModal from '../response-modal/response-modal';

const Profile = () => {
    const [adminName, setAdminName] = useState('');
    const [adminId, setAdminId] = useState('');

    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const [errorClass, setErrorClass] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [errorClassDisplayName, setErrorClassDisplayName] = useState('');
    const [errorClassStoreName, setErrorClassStoreName] = useState('');
    const [errorClassStoreAddress, setErrorClassStoreAddress] = useState('');

    const [errorDisplayName, setErrorDisplayName] = useState('');
    const [errorStoreName, setErrorStoreName] = useState('');
    const [errorStoreAddress, setErrorStoreAddress] = useState('');

    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    
    const handleGetAdminSettings = async () => {
        try {
            const { admin } = await getAdminSettings();
            const { settings } = await getSettings();
            setStoreName(settings.find(setting => setting.setting_key === 'store_name').setting_value);
            setStoreAddress(settings.find(setting => setting.setting_key === 'store_address').setting_value);
            localStorage.setItem('event', false);
            setAdminId(admin.admin_id);
            setAdminName(admin.admin_name);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleGetAdminSettings();
    }, []);

    const handleSetNewAdminName = async () => {
        if(!adminName) {
            setErrorClassDisplayName('error');
            setErrorDisplayName('Name is required.');
            return;
        }
        
        if(adminName.length < 5 || adminName.length > 20) {
            setErrorClassDisplayName('error');
            setErrorDisplayName('Name must be between 5 and 20 characters.');
            return;
        }

        try {
            await setNewAdminName(adminId, adminName);
            setErrorClassDisplayName('');
            setErrorDisplayName('');
            localStorage.setItem('event', true);
            window.location.reload();
        } catch (error) {
            setResponseMessage('Updating admin name failed.');
            setShowResponseModal(true);
            console.error(error);
        }
    }

    const handleSetNewStoreName = async () => {
        if(!storeName) {
            setErrorClassStoreName('error');
            setErrorStoreName('Store name is required.');
            return;
        }

        if(storeName.length <= 0) {
            setErrorClassStoreName('error');
            setErrorStoreName('Store name must have at least 1 character.');
            return;
        }

        try {
            await setNewStoreName(storeName);
            setErrorClassStoreName('');
            setErrorStoreName('');
            setResponseMessage('Store name updated successfully.');
            setShowResponseModal(true);
        } catch (error) {
            setResponseMessage('Updating store name failed.');
            setShowResponseModal(true);
            console.error(error);
        }
    }

    const handleSetNewStoreAddress = async () => {
        if(!storeAddress) {
            setErrorClassStoreAddress('error');
            setErrorStoreAddress('Store address is required.');
            return;
        }

        if(storeAddress.length <= 0) {
            setErrorClassStoreAddress('error');
            setErrorStoreAddress('Address must have at least 1 character.');
            return;
        }

        try {
            await setNewStoreAddress(storeAddress);
            setErrorClassStoreAddress('');
            setErrorStoreAddress('');
            setResponseMessage('Store address updated successfully.');
            setShowResponseModal(true);
        } catch (error) {
            setResponseMessage('Updating store address failed.');
            setShowResponseModal(true);
            console.error(error);
        }
    }

    useEffect(() => {
        let retrieveAdminEvent = localStorage.getItem('event');
        if(retrieveAdminEvent === 'true') {
            setResponseMessage('Admin name updated successfully.');
            setShowResponseModal(true);
            localStorage.setItem('event', false);
        }
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
                    <label htmlFor="name">Display Name</label>
                    <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} className={errorClassDisplayName}/>
                    {errorDisplayName && <p className='error-message'>{errorDisplayName}</p>}
                    <button onClick={handleSetNewAdminName}>Update profile</button>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Store Name</label>
                    <p><em>This will be displayed in your Reports and Receipts.</em></p>
                    <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className={errorClassStoreName}/>
                    {errorStoreName && <p className='error-message'>{errorStoreName}</p>}
                    <button onClick={handleSetNewStoreName}>Update store name</button>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Store Address</label>
                    <p><em>This will be displayed in your Reports, Receipts, and in the Checkout page.</em></p>
                    <input type="text" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} className={errorClassStoreAddress}/>
                    {errorStoreAddress && <p className='error-message'>{errorStoreAddress}</p>}
                    <button onClick={handleSetNewStoreAddress}>Update store address</button>
                </div>
            </div>        
        </div>
  )
}

export default Profile;