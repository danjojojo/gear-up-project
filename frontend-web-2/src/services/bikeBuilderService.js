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

export const getCockpitItems = async () => {
    try {
        const response = await api.get('/bike-builder/cockpit-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching cockpit items:', error);
        throw error;
    }
};

export const getHeadsetItems = async () => {
    try {
        const response = await api.get('/bike-builder/headset-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching headset items:', error);
        throw error;
    }
};

export const getHandlebarItems = async () => {
    try {
        const response = await api.get('/bike-builder/handlebar-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching handlebar items:', error);
        throw error;
    }
};

export const getStemItems = async () => {
    try {
        const response = await api.get('/bike-builder/stem-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching stem items:', error);
        throw error;
    }
};

export const getHubsItems = async () => {
    try {
        const response = await api.get('/bike-builder/hubs-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching hubs items:', error);
        throw error;
    }
};