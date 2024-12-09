const crypto = require('crypto'); // Required if you later implement signature verification
const {v4: uuidv4} = require('uuid');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_WEBHOOK_KEY;

// Handle PayMongo webhook
const handlePaymongoWebhook = async (req, res) => {
    const signatureHeader = req.headers['paymongo-signature'];
    const rawBody = JSON.stringify(req.body);

    if (!signatureHeader) {
        return res.status(400).send('No signature header found');
    }

    const parts = signatureHeader.split(',');
    const timestampPart = parts.find((part) => part.startsWith('t=')).split('=')[1];
    const testSignaturePart = parts.find((part) => part.startsWith('te=')).split('=')[1];
    const liveSignaturePart = parts.find((part) => part.startsWith('li=')).split('=')[1];
    const isLiveMode = req.body.data.attributes.livemode;

    const expectedSignature = isLiveMode ? liveSignaturePart : testSignaturePart;

    const message = `${timestampPart}.${rawBody}`;
    const hmac = crypto.createHmac('sha256', PAYMONGO_SECRET_KEY);
    hmac.update(message);
    const computedSignature = hmac.digest('hex');

    if (computedSignature !== expectedSignature) {
        return res.status(400).send('Invalid signature');
    }

    const event = req.body;


    if (event.data.attributes.type === 'checkout_session.payment.paid') {
        const sessionId = event.data.attributes.data.id;
        const paymentId = event.data.attributes.data.attributes.payments[0].id;
        const paymentType = event.data.attributes.data.attributes.payments[0].attributes.source.type;

        try {
            const updateOrderStatus = `
                UPDATE orders
                SET 
                    payment_status = 'paid', 
                    payment_id = $1, 
                    expires_at = NULL,
                    payment_type = $2
                WHERE checkout_session_id = $3
            `;
            
            const getOrderIDandEmail = `
                SELECT order_name, email
                FROM orders
                WHERE checkout_session_id = $1
            `;
            
            const { rows } = await pool.query(getOrderIDandEmail, [sessionId]);
            
            if (!rows.length) {
                return res.status(404).send('Order not found');
            }

            const orderName = rows[0].order_name;
            const email = rows[0].email;
            
            const link = `${process.env.CUSTOMER_URL}/orders/${orderName}`;

            await pool.query(updateOrderStatus, [paymentId, paymentType, sessionId]);
            await sendEmail(email, orderName, link);
            res.status(200).send('Webhook received');
        } catch (error) {
            res.status(500).send('Failed to process webhook');
        }
    } else {
        res.status(400).send('Unhandled event type');
    }
};


const sendEmail = async (email, orderName, link) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  try {
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Status Link',
      html: `
          <h3>Your order ${orderName} has been successfully paid!</h3>
          <p>Click <a href="${link}">here</a> to view your order status.</p>
      `
    });
  } catch (error) {
    console.error(`Error sending email to ${email}`);  // Log specific error
  }
};

module.exports = { handlePaymongoWebhook };