const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { nanoid } = require('nanoid');
require('dotenv').config();
const axios = require('axios');
const { encrypt } = require('../utils/encrypt');

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

const createCheckoutSession = async (req, res) => {
    try {
        const { name, email, phone, address, lineItems } = req.body;
        console.log('Creating checkout session:', name, email, phone, address, lineItems);
        
        const response = await axios.post('https://api.paymongo.com/v1/checkout_sessions', {
            data: {
                attributes: {
                    billing: {
                        name: name,
                        email: email,
                        phone: phone
                    },
                    send_email_receipt: true,
                    show_description: true,
                    show_line_items: true,
                    description: 'Checkout from AronBikes',
                    line_items: lineItems, // Ensure each item matches the required format
                    payment_method_types: ['gcash', 'paymaya'],
                    cancel_url: `${process.env.CUSTOMER_URL}/checkout`,
                    success_url: `${process.env.CUSTOMER_URL}/checkout/success?status=success`,
                }
            }
        }, {
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString('base64')}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Checkout session created:', response.data.data);
        const checkoutUrl = response.data.data.attributes.checkout_url;
        const checkoutSessionId = response.data.data.id;
        res.status(200).json({ checkoutUrl, checkoutSessionId });
    } catch (error) {
        console.error('Error creating checkout session:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};


const createOrder = async (req, res) => {
    try {
        const { sessionOrder, orderBbDetails, orderItems } = req.body;

        const orderId = 'order-' + uuidv4(); // Generate a unique order ID
        const paymentId = 'none';
        const sessionOrderFirstItem = sessionOrder[0];
        const sessionID = sessionOrderFirstItem.checkoutSessionId;
        const orderName = 'order-' + nanoid(10).toUpperCase();
        const custName = sessionOrderFirstItem.name;
        const email = sessionOrderFirstItem.email;
        const phone = sessionOrderFirstItem.phone;
        const custAddress = sessionOrderFirstItem.address;
        const paymentStatus = 'pending';
        const orderStatus = 'pending';
        const bbOption = sessionOrderFirstItem.bikeBuildDelivery;
        const buOption = sessionOrderFirstItem.bikeUpgradeDelivery;
        const orderAmount = sessionOrderFirstItem.amount;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

        const ordersInsert = `
            INSERT INTO orders (order_id, payment_id, checkout_session_id, order_name, order_amount, cust_name, email, phone, cust_address, payment_status, order_status, bb_option, bu_option, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `
        const ordersValues = [
            orderId, paymentId, sessionID, orderName, orderAmount, custName, email, phone, custAddress, paymentStatus, orderStatus, bbOption, buOption, expiresAt
        ];

        console.log('1');
        let ordersBBInsert = `INSERT INTO orders_bb (build_id, order_id, build_name, build_image, build_price) VALUES `
        let ordersBBValues = [];
        let ordersBBInsertColumns = 5;
        if(orderBbDetails) {
            for(let i = 0; i < orderBbDetails.length; i++) {
                const buildId = 'build-' + uuidv4(); // Generate a unique build ID
                ordersBBInsert += `(
                $${i * ordersBBInsertColumns + 1}, 
                $${i * ordersBBInsertColumns + 2}, 
                $${i * ordersBBInsertColumns + 3}, 
                $${i * ordersBBInsertColumns + 4},
                $${i * ordersBBInsertColumns + 5})
                `;

                ordersBBValues.push(buildId, orderId, orderBbDetails[i].build_name, orderBbDetails[i].image, orderBbDetails[i].build_price);

                if (i != orderBbDetails.length - 1) {
                    ordersBBInsert += ", ";
                }
            }
        }
        console.log(ordersBBInsert, ordersBBValues);

        let ordersItemsInsert = `INSERT INTO order_items (order_item_id, order_id, item_id, item_qty, item_price, build_id, part_type, part) VALUES `
        let ordersItemsValues = [];
        let ordersItemsInsertColumns = 8;
        if(orderItems) {
            for(let i = 0; i < orderItems.length; i++) {
                let orderItemId = 'order-item-' + uuidv4(); // Generate a unique order item ID
                ordersItemsInsert += `(
                $${i * ordersItemsInsertColumns + 1}, 
                $${i * ordersItemsInsertColumns + 2}, 
                $${i * ordersItemsInsertColumns + 3}, 
                $${i * ordersItemsInsertColumns + 4},
                $${i * ordersItemsInsertColumns + 5},
                $${i * ordersItemsInsertColumns + 6},
                $${i * ordersItemsInsertColumns + 7},
                $${i * ordersItemsInsertColumns + 8})
                `;

                ordersItemsValues.push(orderItemId, orderId, orderItems[i].id, orderItems[i].quantity, orderItems[i].amount, orderItems[i].build_id, orderItems[i].type, orderItems[i].part);
                
                if (i != orderItems.length - 1) {
                    ordersItemsInsert += ", ";
                }
            }
        }
        console.log(ordersItemsInsert, ordersItemsValues);

        console.log('3');
        await pool.query("BEGIN;");
        await pool.query(ordersInsert, ordersValues);
        console.log('4');
        if(ordersBBValues.length) await pool.query(ordersBBInsert, ordersBBValues);
        console.log('5');
        if (ordersItemsValues.length) await pool.query(ordersItemsInsert, ordersItemsValues);
        await pool.query("COMMIT;");
        console.log('Order created', ordersInsert, ordersValues);
        res.status(200).json({ message: 'Order created' });
    } catch (error) {
        await pool.query("ROLLBACK;");
        res.status(500).json({ error: 'Failed to create order', error: error.message });
    }
}

module.exports = { 
    createCheckoutSession,
    createOrder
};
