import api from './api';

export const getSettings = async () => {
    try {
        const response = await api.get('/settings/get-settings');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAdminSettings = async () => {
    try {
        const response = await api.get('/settings/get-admin-settings');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const setMechanicPercentage = async (percentage) => {
    try {
        const response = await api.put('/settings/set-mechanic-percentage', { percentage });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const setNewAdminName = async (admin_id, newName) => {
    try {
        const response = await api.put(`/settings/set-new-admin-name/${admin_id}`, { newName });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const setDisplayStockLevelPOS = async (displayValue) => {
    try {
        const response = await api.put('/settings/set-display-stock-level-pos', { displayValue });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const setDisplayExpenses = async (displayValue) => {
    try {
        const response = await api.put('/settings/set-display-expenses', { displayValue });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const setNewStoreName = async (storeName) => {
    try {
        const response = await api.put('/settings/set-new-store-name', { storeName });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const setNewStoreAddress = async (storeAddress) => {
    try {
        const response = await api.put('/settings/set-new-store-address', { storeAddress });
        return response.data;
    } catch (error) {
        throw error;
    }
}
