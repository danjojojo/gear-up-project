const crypto = require('crypto'); // Required if you later implement signature verification
const {v4: uuidv4} = require('uuid');
const pool = require('../config/db');
require('dotenv').config();

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_WEBHOOK_KEY;

// Handle PayMongo webhook
const handlePaymongoWebhook = async (req, res) => {
    const signatureHeader = req.headers['paymongo-signature'];
    const rawBody = JSON.stringify(req.body); // Capture the raw request body as a string

    if (!signatureHeader) {
        console.error('No signature header found');
        return res.status(400).send('No signature header found');
    }   

     // Step 1: Parse the signature header
    const parts = signatureHeader.split(',');
    const timestampPart = parts.find((part) => part.startsWith('t=')).split('=')[1];
    const testSignaturePart = parts.find((part) => part.startsWith('te=')).split('=')[1];
    const liveSignaturePart = parts.find((part) => part.startsWith('li=')).split('=')[1];
    const isLiveMode = req.body.data.attributes.livemode;

    const expectedSignature = isLiveMode ? liveSignaturePart : testSignaturePart;

    // Step 2: Create the HMAC signature
    const message = `${timestampPart}.${rawBody}`;
    const hmac = crypto.createHmac('sha256', PAYMONGO_SECRET_KEY);
    hmac.update(message);
    const computedSignature = hmac.digest('hex');

    // Step 3: Compare signatures
    if (computedSignature !== expectedSignature) {
        console.error('Invalid signature');
        return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    console.log('Received Webhook Event:', JSON.stringify(event, null, 2)); // Log full event data

    if (event.data.attributes.type === 'checkout_session.payment.paid') {
        // Access the first payment in the payments array
        const sessionId = event.data.attributes.data.id;
        const paymentId = event.data.attributes.data.attributes.payments[0].id;
        const paymentType = event.data.attributes.data.attributes.payments[0].attributes.source.type

        try {
            const updateOrderStatus = `
                UPDATE orders
                SET 
                    payment_status = 'paid', 
                    payment_id = $1, 
                    expires_at = NULL,
                    payment_type = $2
                WHERE checkout_session_id = $3
            `
            await pool.query(updateOrderStatus, [paymentId, paymentType, sessionId]);
            // console.log('Order updated successfully', paymentId, sessionId);
            res.status(200).send('Webhook received');
        } catch (error) {
            console.error('Error updating order:', error.message);
            res.status(500).send('Failed to update order');
        }
    } else {
        res.status(400).send('Unhandled event type');
    }
};

module.exports = { handlePaymongoWebhook };