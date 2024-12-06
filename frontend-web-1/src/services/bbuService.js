import api from './api';

// Fetch bike types
export const getBikeTypes = async () => {
    try {
        const response = await api.get('/bike-builder-upgrader/bike-types');
        return response.data;
    } catch (error) {
        console.error('Error fetching bike types:', error);
        throw error;
    }
};

// Fetch all parts
export const getAllParts = async () => {
    try {
        const response = await api.get('/bike-builder-upgrader/all-parts');
        return response.data;
    } catch (error) {
        console.error('Error fetching all parts:', error);
        throw error;
    }
};

// Fetch part specs
export const getPartSpecs = async (partName, specId) => {
    try {
        const response = await api.get(`/bike-builder-upgrader/part-specs/${partName}&${specId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching part specs:', error);
        throw error;
    }
};

// Add bike type
export const addBikeType = async (bikeTypeData) => {
    try {
        const response = await api.post('/bike-builder-upgrader/add-bike-type', bikeTypeData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding bike type:', error);
        throw error;
    }
}

// Edit bike type
export const editBikeType = async (bikeTypeId, bikeTypeData) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/edit-bike-type/${bikeTypeId}`, bikeTypeData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error editing bike type:', error);
        throw error;
    }
}

// Delete bike type
export const deleteBikeType = async (bikeTypeId) => {
    try {
        const response = await api.delete(`/bike-builder-upgrader/delete-bike-type/${bikeTypeId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting bike type:', error);
        throw error;
    }
}

// Fetch item count
export const getItemCount = async (partType, bikeType) => {
    try {
        const response = await api.get(`/bike-builder-upgrader/part-count/${partType}&${bikeType}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching item count for ${partType}:`, error);
        throw error;
    }
};

// Fetch compatibility specs
export const getCompatibilitySpecs = async (bikeType) => {
    try {
        const response = await api.get(`/bike-builder-upgrader/compatibility-specs/${bikeType}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching compatibility specs:', error);
        throw error;
    }
}

// Add upgrader spec form
export const addUpgraderSpecForm = async (bikeType, indPart, depPart, indSpec, depSpec ) => {
    try {
        const response = await api.post('/bike-builder-upgrader/add-upgrader-spec-form', {
             bikeType, indPart, depPart, indSpec, depSpec 
        });
        return response.data;
    } catch (error) {
        console.error('Error adding upgrader spec form:', error);
        throw error;
    }
}

// Update upgrader spec form
export const updateUpgraderSpecForm = async (specId, depPart, indSpec, depSpec) => {
    try {
        const response = await api.put(`/bike-builder-upgrader/update-upgrader-spec-form/${specId}`, {
              depPart, indSpec, depSpec 
        });
        return response.data;
    } catch (error) {
        console.error('Error updating upgrader spec form:', error);
        throw error;
    }
}

// Delete upgrader spec form
export const deleteUpgraderSpecForm = async (specId) => {
    try {
        const response = await api.delete(`/bike-builder-upgrader/delete-upgrader-spec-form/${specId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting upgrader spec form:', error);
        throw error;
    }
}

// Fetch frame items
export const getFrameItems = async (archived, bikeType) => {
    try {
        const response = await api.get('/bike-builder-upgrader/frame-item', {
            params: { archived, bikeType },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching frame items:', error);
        throw error;
    }
};

// Fetch fork items
export const getForkItems = async (archived, bikeType) => {
    try {
        const response = await api.get('/bike-builder-upgrader/fork-item', {
            params: { archived, bikeType }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching fork items:', error);
        throw error;
    }
};

// Fetch groupset items
export const getGroupsetItems = async (archived, bikeType) => {
    try {
        const response = await api.get('/bike-builder-upgrader/groupset-item', {
            params: { archived, bikeType }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching groupset items:', error);
        throw error;
    }
};

// Fetch wheelset items
export const getWheelsetItems = async (archived, bikeType) => {
    try {
        const response = await api.get('/bike-builder-upgrader/wheelset-item', {
            params: { archived, bikeType }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching wheelset items:', error);
        throw error;
    }
};

// Fetch seat items
export const getSeatItems = async (archived, bikeType) => {
    try {
        const response = await api.get('/bike-builder-upgrader/seat-item', {
            params: { archived, bikeType }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching seat items:', error);
        throw error;
    }
};

// Fetch cockpit items
export const getCockpitItems = async (archived, bikeType) => {
    try {
        const response = await api.get('/bike-builder-upgrader/cockpit-item', {
            params: { archived, bikeType }
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

// get item reviews
export const getItemReviews = async (itemId) => {
    try {
        const response = await api.get(`/bike-builder/reviews/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching item reviews:', error);
        throw error;
    }
};


