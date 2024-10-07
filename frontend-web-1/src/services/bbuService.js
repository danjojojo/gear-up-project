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

// Fetch wheelset items
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

// Fetch seat items
export const getSeatItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/seat-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching seat items:', error);
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

// Fetch headset items
export const getHeadsetItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/headset-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching headset items:', error);
        throw error;
    }
};

// Fetch handlebar items
export const getHandlebarItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/handlebar-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching handlebar items:', error);
        throw error;
    }
};

// Fetch stem items
export const getStemItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/stem-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching stem items:', error);
        throw error;
    }
};

// Fetch hubs items
export const getHubsItems = async (archived) => {
    try {
        const response = await api.get('/bike-builder-upgrader/hubs-item', {
            params: { archived }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hubs items:', error);
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

// Update seat item
export const updateSeatItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-seat/${itemId}`, updatedData);
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

// Update headset item
export const updateHeadsetItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-headset/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Update handlebar item
export const updateHandlebarItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-handlebar/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Update stem item
export const updateStemItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-stem/${itemId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
};

// Update hubs item
export const updateHubsItem = async (itemId, updatedData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-hubs/${itemId}`, updatedData);
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

// Archive seat item
export const archiveSeatItem = async (seat_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-seat/${seat_id}`);
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

// Archive headset item
export const archiveHeadsetItem = async (headset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-headset/${headset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error;
    }
};

// Archive handlebar item
export const archiveHandlebarItem = async (handlebar_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-handlebar/${handlebar_id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error;
    }
};

// Archive stem item
export const archiveStemItem = async (stem_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-stem/${stem_id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating item status:', error);
        throw error;
    }
};

// Archive hubs item
export const archiveHubsItem = async (hub_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/archive-hubs/${hub_id}`);
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

// Restore seat item
export const restoreSeatItem = async (seat_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-seat/${seat_id}`);
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

// Restore headset item
export const restoreHeadsetItem = async (headset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-headset/${headset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error;
    }
};

// Restore handlebar item
export const restoreHandlebarItem = async (handlebar_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-handlebar/${handlebar_id}`);
        return response.data;
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error;
    }
};

// Restore stem item
export const restoreStemItem = async (stem_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-stem/${stem_id}`);
        return response.data;
    } catch (error) {
        console.error('Error restoring item:', error);
        throw error;
    }
};

// Restore hubs item
export const restoreHubsItem = async (hub_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/restore-hubs/${hub_id}`);
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

// Delete seat item
export const deleteSeatItem = async (seat_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-seat/${seat_id}`);
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

// Delete headset item
export const deleteHeadsetItem = async (headset_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-headset/${headset_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

// Delete handlebar item
export const deleteHandlebarItem = async (handlebar_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-handlebar/${handlebar_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

// Delete stem item
export const deleteStemItem = async (stem_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-stem/${stem_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

// Delete hubs item
export const deleteHubsItem = async (hub_id) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/delete-hubs/${hub_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};
