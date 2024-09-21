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

