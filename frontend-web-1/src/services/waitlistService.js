import api from './api';

// Fetch waitlist items
export const getWaitlistItems = async () => {
    try {
        const response = await api.get('/waitlist/waitlist-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching waitlist items:', error);
        throw error;
    }
};

// Add item to frame
export const addFrame = async (frameData) => {
    try {
        const response = await api.post('/waitlist/add-frame', frameData);
        return response.data;
    } catch (error) {
        console.error('Error adding frame:', error);
        throw error;    
    }
};

// Add item to fork
export const addFork = async (forkData) => {
    try {
        const response = await api.post('/waitlist/add-fork', forkData);
        return response.data;
    } catch (error) {
        console.error('Error adding fork:', error);
        throw error;    
    }
};

// Add item to groupset
export const addGroupset = async (groupsetData) => {
    try {
        const response = await api.post('/waitlist/add-groupset', groupsetData);
        return response.data;
    } catch (error) {
        console.error('Error adding groupset:', error);
        throw error;    
    }
};

