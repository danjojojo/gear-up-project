import api from './api';

export const getFrameItems = async () => {
    try {
        const response = await api.get('/bike-builder/frame-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching frame items:', error);
        throw error;
    }
};

export const getForkItems = async () => {
    try {
        const response = await api.get('/bike-builder/fork-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching fork items:', error);
        throw error;
    }
};

export const getGroupsetItems = async () => {
    try {
        const response = await api.get('/bike-builder/groupset-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching groupset items:', error);
        throw error;
    }
};

export const getWheelsetItems = async () => {
    try {
        const response = await api.get('/bike-builder/wheelset-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching wheelset items:', error);
        throw error;
    }
};

export const getSeatItems = async () => {
    try {
        const response = await api.get('/bike-builder/seat-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching seat items:', error);
        throw error;
    }
};

export const getCockpitItems = async () => {
    try {
        const response = await api.get('/bike-builder/cockpit-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching cockpit items:', error);
        throw error;
    }
};

export const getAnyItems = async (desiredPart) => {
    try {
        const response = await api.get(`/bike-builder/${desiredPart}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${desiredPart} items:`, error);
        throw error;
    }
};