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

// Display items
export const displayItems = async () => {
    try {
        const response = await api.get('/inventory/display-item');
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};