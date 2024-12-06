import api from './api';


export const loginUser = async (credential) => {
    try {
        const response = await api.post('/user/login', {
             credential 
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getProfile = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const logoutUser = async () => {
    try {
        await api.post('/user/logout');
    } catch (error) {
        console.error(error);
    }
}

export const getOrderHistory = async () => {
    try {
        const response = await api.get('/user/order-history');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const submitReview = async (reviewData) => {
    try {
        const response = await api.post('/user/submit-review', reviewData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}