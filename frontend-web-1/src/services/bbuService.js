import api from './api';

// Fetch item count
export const getItemCount = async (partType) => {
    try {
        const response = await api.get(`/bike-builder-upgrader/part-count/${partType}`);
        return response.data;  
    } catch (error) {
        console.error(`Error fetching item count for ${partType}:`, error);
        throw error;  
    }
};

// Fetch frame items
export const getFrameItems = async () => {
    try {
        const response = await api.get('/bike-builder-upgrader/frame-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching frame items:', error);
        throw error;
    }
};

// Fetch fork items
export const getForkItems = async () => {
    try {
        const response = await api.get('/bike-builder-upgrader/fork-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching fork items:', error);
        throw error;
    }
};

// Fetch groupset items
export const getGroupsetItems = async () => {
    try {
        const response = await api.get('/bike-builder-upgrader/groupset-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching groupset items:', error);
        throw error;
    }
};

// Fetch Wheelset items
export const getWheelsetItems = async () => {
    try {
        const response = await api.get('/bike-builder-upgrader/wheelset-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching wheelset items:', error);
        throw error;
    }
};

// Fetch cockpit items
export const getCockpitItems = async () => {
    try {
        const response = await api.get('/bike-builder-upgrader/cockpit-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching cockpit items:', error);
        throw error;
    }
};