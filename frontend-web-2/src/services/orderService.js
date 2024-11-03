import api from './api';

export const getOrder = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting order:', error.message);
        return { error: error.message };
    }
}