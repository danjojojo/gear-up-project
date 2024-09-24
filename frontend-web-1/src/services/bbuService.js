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

// Update frame item
export const updateFrameItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-frame/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Update fork item
export const updateForkItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-fork/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Update groupset item
export const updateGroupsetItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-groupset/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Update wheelset item
export const updateWheelsetItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-wheelset/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Update cockpit item
export const updateCockpitItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-cockpit/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

