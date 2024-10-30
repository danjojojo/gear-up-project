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

export const editMechanic = async (mechanicID, mechanicData) => {
    try {
        const response = await api.put(`/mechanics/edit-mechanic/${mechanicID}`, mechanicData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error editing mechanic', error); 
        throw error;
    }
}

export const changeMechanicStatus = async (mechanicID, mechanicStatus) => {
    try {
        const response = await api.put(`/mechanics/change-mechanic-status/${mechanicID}`, {status : mechanicStatus});
        return response.data;
    } catch (error) {
        console.error('Error archiving mechanic', error);
        throw error;
    }
}

export const deleteMechanic = async (mechanicID) => {
    try {
        const response = await api.put(`/mechanics/delete-mechanic/${mechanicID}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting mechanic', error);
        throw error;
    }
}