import api from './api';

export async function createCheckoutSession(name, email, phone, address, lineItems, sessionOrder, orderItems ) {
    try {
        const response = await api.post('/checkout/create-checkout-session', { name, email, phone, address, lineItems, sessionOrder, orderItems });
        return response.data;
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        throw new Error('Failed to create checkout session');
    }
}

export async function createOrder(sessionOrder, orderBbDetails, orderItems) {
    try {
        const response = await api.post('/checkout/create-order', { sessionOrder, orderBbDetails, orderItems });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error.message);
        throw new Error('Failed to create order', error.message);
    }
}

export const getSettings = async () => {
    try {
        const response = await api.get('/settings/get-settings');
        return response.data;
    } catch (error) {
        throw error;
    }
}