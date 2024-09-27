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
export const getFrameItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/frame-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching frame items:', error);
        throw error;
    }
};

// Fetch fork items
export const getForkItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/fork-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching fork items:', error);
        throw error;
    }
};

// Fetch groupset items
export const getGroupsetItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/groupset-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching groupset items:', error);
        throw error;
    }
};

// Fetch Wheelset items
export const getWheelsetItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/wheelset-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching wheelset items:', error);
        throw error;
    }
};

// Fetch cockpit items
export const getCockpitItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/cockpit-item', {
            params: { archived }
        });
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

// Archive frame item
export const archiveFrameItem = async (frame_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-frame/${frame_id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error;
    }
};

// Archive fork item
export const archiveForkItem = async (fork_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-fork/${fork_id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error;
    }
};

// Archive groupset item
export const archiveGroupsetItem = async (groupset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-groupset/${groupset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error;
    }
};

// Archive wheelset item
export const archiveWheelsetItem = async (wheelset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-wheelset/${wheelset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error;
    }
};

// Archive cockpit item
export const archiveCockpitItem = async (cockpit_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-cockpit/${cockpit_id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error;
    }
};

// Restore frame item
export const restoreFrameItem = async (frame_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-frame/${frame_id}`);
        return response.data;
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error;
    }
};

// Restore fork item
export const restoreForkItem = async (fork_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-fork/${fork_id}`);
        return response.data;
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error;
    }
};

// Restore groupset item
export const restoreGroupsetItem = async (groupset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-groupset/${groupset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error;
    }
};

// Restore wheelset item
export const restoreWheelsetItem = async (wheelset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-wheelset/${wheelset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error;
    }
};

// Restore cockpit item
export const restoreCockpitItem = async (cockpit_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-cockpit/${cockpit_id}`);
        return response.data;
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error;
    }
};

// Delete frame item
export const deleteFrameItem = async (frame_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-frame/${frame_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

// Delete fork item
export const deleteForkItem = async (fork_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-fork/${fork_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

// Delete groupset item
export const deleteGroupsetItem = async (groupset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-groupset/${groupset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

// Delete wheelset item
export const deleteWheelsetItem = async (wheelset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-wheelset/${wheelset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

// Delete cockpit item
export const deleteCockpitItem = async (cockpit_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-cockpit/${cockpit_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

