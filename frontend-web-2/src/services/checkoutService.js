import api from './api';

export async function createCheckoutSession(name, email, phone, address, lineItems) {
    try {
        const response = await api.post('/checkout/create-checkout-session', { name, email, phone, address, lineItems });
        return response.data.checkoutUrl;
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        throw new Error('Failed to create checkout session');
    }
}