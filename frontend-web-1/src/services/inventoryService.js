import api from './api';

// Display dashboard data
export const dashboardData = async () => {
    try {
        const response = await api.get('/inventory/dashboard-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

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

// Get item details
export const getItemDetails = async (itemId) => {
    try {
        const response = await api.get(`/inventory/item/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching item details:', error);
        throw error;
    }
};


// Update item
export const updateItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/inventory/item/${itemId}`, updatedData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};