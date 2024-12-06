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

export const getCompatibilitySpecs = async (bikeType) => {
    try {
        const response = await api.get(`/bike-builder-upgrader/compatibility-specs/${bikeType}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching compatibility specs:', error);
        throw error;
    }
}

export const getFrameItems = async (typeTag) => {
    try {
        const response = await api.get(`/bike-builder/frame-item/${typeTag}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching frame items:', error);
        throw error;
    }
};

export const getForkItems = async (typeTag) => {
    try {
        const response = await api.get(`/bike-builder/fork-item/${typeTag}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching fork items:', error);
        throw error;
    }
};

export const getGroupsetItems = async (typeTag) => {
    try {
        const response = await api.get(`/bike-builder/groupset-item/${typeTag}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching groupset items:', error);
        throw error;
    }
};

export const getWheelsetItems = async (typeTag) => {
    try {
        const response = await api.get(`/bike-builder/wheelset-item/${typeTag}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching wheelset items:', error);
        throw error;
    }
};

export const getSeatItems = async (typeTag) => {
    try {
        const response = await api.get(`/bike-builder/seat-item/${typeTag}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching seat items:', error);
        throw error;
    }
};

export const getCockpitItems = async (typeTag) => {
    try {
        const response = await api.get(`/bike-builder/cockpit-item/${typeTag}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cockpit items:', error);
        throw error;
    }
};


export const getAnyItems = async (desiredPart, filterValues) => {
    try {
        const response = await api.get(`/bike-builder/${desiredPart}`, {
            params: { filterValues }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${desiredPart} items:`, error);
        throw error;
    }
};

export const getItemReviews = async (itemId) => {
    try {
        const response = await api.get(`/bike-builder/reviews/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching item reviews:', error);
        throw error;
    }
};


