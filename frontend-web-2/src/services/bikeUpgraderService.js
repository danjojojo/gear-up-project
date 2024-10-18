import api from './api';

export const getHeadsetItems = async () => {
    try {
        const response = await api.get('/bike-upgrader/headset-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching headset items:', error);
        throw error;
    }
};