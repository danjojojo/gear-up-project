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
export const displayItems = async (archived) => {
    try {
        const response = await api.get(`/inventory/display-item`, {
            params: { archived }
        });
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
        const response = await api.put(`/inventory/item/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Archive item
export const archiveItem = async (item_id) => {
    try {
        const response = await api.put(`/inventory/archive-item/${item_id}`);
        return response.data; 
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error; 
    }
};

// Restore item
export const restoreItem = async (item_id) => { 
    try {
        const response = await api.put(`/inventory/restore-item/${item_id}`);
        return response.data; 
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error; 
    }
};

// Delete item
export const deleteItem = async (item_id) => { 
    try {
        const response = await api.put(`/inventory/delete-item/${item_id}`);
        return response.data; 
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error; 
    }
};

// Restock item
export const restockItem = async (item_id, stockAdded, stockBefore) => { 
    try {
        const response = await api.put(`/inventory/restock-item/${item_id}`, { stockAdded, stockBefore });
        return response.data; 
    } catch (error) {
        console.error('Error restocking item:', error);
        throw error; 
    }
};