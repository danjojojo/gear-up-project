const crypto = require('crypto'); // Required if you later implement signature verification

// Handle PayMongo webhook
const handlePaymongoWebhook = (req, res) => {
    const event = req.body;

    console.log('Received Webhook Event:', JSON.stringify(event, null, 2)); // Log full event data

    if (event.data.attributes.type === 'checkout_session.payment.paid') {
        const paymentDetails = event.data.attributes.data.attributes;
        const paymentId = event.data.id;

        // Access the first payment in the payments array
        const payment = paymentDetails.payments[0].attributes;

        const amount = payment.amount;
        const currency = payment.currency;
        const customerEmail = paymentDetails.billing.email;
        const lineItems = paymentDetails.line_items;

        console.log(`Payment successful for Payment ID: ${paymentId}`);
        console.log(`Amount: ${amount}, Currency: ${currency}, Customer Email: ${customerEmail}`);
        console.log('Items Purchased:', lineItems);

        // Process the successful payment
        // Example: update the order status in your database
        // updateOrderStatus(paymentId, 'paid');

        // Optional: Notify the frontend via WebSocket, etc.
        // broadcast({ type: 'payment_success', paymentId });
    }

    res.status(200).send('Webhook received');
};

module.exports = { handlePaymongoWebhook };