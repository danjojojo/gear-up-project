import api from './api';



export const getOrders = async (startDate) => {
    try {
        const response = await api.get(`/orders/get-orders/${startDate}`);
        return response.data;
    } catch (error) {
        console.error('Error getting orders:', error.message);
        throw new Error('Failed to get orders');
    }
} 

export const getOrdersItems = async (orderId) => {
    try {
        const response = await api.get(`/orders/get-orders-items/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting orders:', error.message);
        throw new Error('Failed to get orders');
    }
}

export const updateOrderStatus = async (orderId, changeStatusTo, orderName, email) => {
    try {
        const response = await api.put(`/orders/update-order-status/${orderId}`, { changeStatusTo, orderName, email });
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error.message);
        throw new Error('Failed to update order status');
    }
}

export const updateOrderShipping = async (orderId, trackingNumber, courier) => {
    try {
        const response = await api.put(`/orders/update-order-shipping/${orderId}`, { trackingNumber, courier });
        return response.data;
    } catch (error) {
        console.error('Error updating order shipping:', error.message);
        throw new Error('Failed to update order shipping');
    }
}

export const deductStockForCompletedOrder = async (orderId) => {
    try {
        const response = await api.put(`/orders/deduct-stock-for-completed-order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error deducting stock:', error.message);
        throw new Error('Failed to deduct stock');
    }
}

export const getOrderDates = async () => {
    try {
        const response = await api.get('/orders/get-order-dates');
        return response.data;
    } catch (error) {
        console.error('Error getting order dates:', error.message);
        throw new Error('Failed to get order dates');
    }
}

export const getOrderStatistics = async (startDate) => {
    try {
        const response = await api.get(`orders/get-order-statistics/${startDate}`);
        return response.data;
    } catch (error) {
        console.error('Error getting order statistics:', error.message);
        throw new Error('Failed to get order statistics');
    }
}

export const deleteExpiredOrder = async (orderId) => {
    try {
        const response = await api.delete(`/orders/delete-expired-order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting expired order:', error.message);
        throw new Error('Failed to delete expired order');
    }
}