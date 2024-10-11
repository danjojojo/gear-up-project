import api from './api';

export const getMechanics = async () => {
    try {
        const response = await api.get('/mechanics/get-mechanics');
        return response.data;
    } catch (error) {
        console.error('Error getting mechanics', error);
        throw error;
    }
}

export const addMechanic = async (mechanicData) => {
    try {
        const response = await api.post('/mechanics/add-mechanic', mechanicData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding mechanic', error);
        throw error;
    }
}