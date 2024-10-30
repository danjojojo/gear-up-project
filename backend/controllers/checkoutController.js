const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();
const axios = require('axios');

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

const createCheckoutSession = async (req, res) => {
    try {
        const { name, email, phone, address, lineItems } = req.body;

        console.log('Creating checkout session:', name, email, phone, address, lineItems);

        const response = await axios.post('https://api.paymongo.com/v1/checkout_sessions', {
            data: {
                attributes: {
                    billing: {
                        name : name,
                        email : email,
                        phone : phone
                    },
                    send_email_receipt: true,
                    show_description: true,
                    show_line_items: true,
                    description: 'Checkout from AronBikes',
                    line_items: lineItems, // Products in the cart
                    payment_method_types: ['gcash'],
                    cancel_url: 'http://localhost:3000/checkout',
                    success_url: 'http://localhost:3000/checkout',
                }
            }
        }, {
            headers: {
                Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`,
                'Content-Type': 'application/json'
            }
        });

        const checkoutUrl = response.data.data.attributes.checkout_url;
        console.log('Checkout URL:', checkoutUrl);
        res.status(200).json({ checkoutUrl });
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

module.exports = { createCheckoutSession };
