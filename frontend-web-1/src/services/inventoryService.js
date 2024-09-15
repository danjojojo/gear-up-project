import api from './api';

// Add item 
export const addItem = async (itemData) => {
    try {
        const response = await api.post('/inventory/add-item', itemData);
        return response.data;
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
};