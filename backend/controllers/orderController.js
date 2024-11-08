const pool = require('../config/db');
const { decrypt } = require('../utils/encrypt');
const nodemailer = require('nodemailer');

const getOrders = async (req, res) => {
    try {
        const { startDate } = req.params;
        console.log(startDate);
        const query = `
            SELECT * 
            FROM orders
            WHERE DATE(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1
            ORDER BY date_created DESC;
        `
        const { rows } = await pool.query(query, [startDate]);

        res.status(200).json({ orders : rows });

    } catch (error) {
        console.error('Error getting orders:', error.message);
        res.status(500).json({ error: error.message });
    }
}

const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('orderId:', orderId);
        console.log(orderId);
        const orderQuery = `
            SELECT * 
            FROM orders
            WHERE order_name = $1
        `
        const oResult = await pool.query(orderQuery, [orderId]);
       
        const itemsQuery = `
            SELECT 
                oi.*, 
                i.item_name,
                CASE
                    WHEN oi.part_type = 'Bike Upgrader' AND o.bu_option = 'deliver-home'THEN 'TR'
                    WHEN oi.part_type = 'Bike Upgrader' AND o.bu_option = 'pickup-store' THEN 'TP'
                    WHEN oi.part_type = 'Bike Builder' AND o.bb_option = 'pickup-store' THEN 'TP'
                    ELSE oi.part_type
                END AS part_type
            FROM order_items oi
            JOIN items i ON oi.item_id = i.item_id
            JOIN orders o ON oi.order_id = o.order_id
            WHERE o.order_name = $1;
        `
        const iResult = await pool.query(itemsQuery, [orderId]);

        res.status(200).json({ order : oResult.rows[0], items: iResult.rows });
    } catch (error) {
        console.error('Error getting orders:', error.message);
        res.status(500).json({ error: error.message });
    }
}

const getOrderDates = async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT DATE(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') AS date_created
            FROM orders
            ORDER BY date_created DESC
        `;
        const { rows } = await pool.query(query);
        res.status(200).json({ dates: rows });
    } catch (error) {
        console.error('Error getting order dates:', error.message);
        res.status(500).json({ error: error.message });
    }
}

const getOrdersItems = async (req, res) => {
    try {
        // get order_id
        const { orderId } = req.params;

        // get order_items
        const query = `
            SELECT 
                oi.*, 
                i.item_name,
                i.stock_count,
                CASE 
                    WHEN oi.part = 'Frame' THEN encode(f.image, 'base64')
                    WHEN oi.part = 'Fork' THEN encode(fk.image, 'base64')
                    WHEN oi.part = 'Groupset' THEN encode(g.image, 'base64')
                    WHEN oi.part = 'Wheelset' THEN encode(w.image, 'base64')
                    WHEN oi.part = 'Seat' THEN encode(s.image, 'base64')
                    WHEN oi.part = 'Cockpit' THEN encode(c.image, 'base64') 
                    ELSE encode(i.item_image, 'base64')
                END AS image
            FROM order_items oi
            JOIN items i ON oi.item_id = i.item_id
            LEFT JOIN frame f ON i.item_id = f.item_id AND i.bike_parts = 'Frame'
            LEFT JOIN fork fk ON i.item_id = fk.item_id AND i.bike_parts = 'Fork'
            LEFT JOIN groupset g ON i.item_id = g.item_id AND i.bike_parts = 'Groupset'
            LEFT JOIN wheelset w ON i.item_id = w.item_id AND i.bike_parts = 'Wheelset'
            LEFT JOIN seat s ON i.item_id = s.item_id AND i.bike_parts = 'Seat'
            LEFT JOIN cockpit c ON i.item_id = c.item_id AND i.bike_parts = 'Cockpit'
            WHERE oi.order_id = $1;
        `
        const { rows } = await pool.query(query, [orderId]);
        res.status(200).json({ items : rows });
    } catch (error) {
        console.error('Error getting orders:', error.message);
        res.status(500).json({ error: 'Failed to get orders' });
    }

}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { changeStatusTo, orderName, email } = req.body;

        let query = ``;
        let queryParams = [orderId]; // Start with orderId as the only parameter

        const link = `${process.env.CUSTOMER_URL}/orders/${orderName}`;
        let statusMessage = '';

        switch (changeStatusTo) {
            case 'in-process':
                const orderItemsQuery = `
                    SELECT O.item_id, item_name, item_qty, stock_count
                    FROM order_items O 
                    JOIN items I ON O.item_id = I.item_id
                    WHERE order_id = $1
                `;
                const orderItemsResult = await pool.query(orderItemsQuery, [orderId]);
        
                if (orderItemsResult.rows.length === 0) {
                    return res.status(404).json({ message: 'No items found for this order' });
                }
        
                // loop through the order items and check if stock_count is 0
                for (let i = 0; i < orderItemsResult.rows.length; i++) {
                    const item = orderItemsResult.rows[i];
                    if (item.stock_count < item.item_qty) {
                        return res.status(200).json({ message: 'no-stock' });
                    }
                }

                query = `
                    UPDATE orders
                    SET order_status = $1, processed_at = NOW()
                    WHERE order_id = $2
                `;
                queryParams = [changeStatusTo, orderId];
                statusMessage = 'processed';
                break;
            case 'ready-pickup':
                query = `
                    UPDATE orders
                    SET pickup_ready_date = NOW()
                    WHERE order_id = $1
                `;
                statusMessage = 'prepared for pickup';
                break;
            case 'ready-shipped':
                query = `
                    UPDATE orders
                    SET shipped_at = NOW()
                    WHERE order_id = $1
                `;
                statusMessage = 'shipped';
                break;
            case 'completed':
                query = `
                    UPDATE orders
                    SET order_status = $1, completed_at = NOW()
                    WHERE order_id = $2
                `;
                queryParams = [changeStatusTo, orderId];
                statusMessage = 'completed';
                break;
            default:
                query = `
                    UPDATE orders
                    SET order_status = $1
                    WHERE order_id = $2
                `;
                queryParams = [changeStatusTo, orderId];
                statusMessage = 'updated';
                break;
        }
        
        await pool.query(query, queryParams);
        await sendEmail(email, orderName, link, statusMessage);
        res.status(200).json({ message: 'Order status updated' });
    } catch (error) {
        console.error('Error updating order:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const deleteExpiredOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const query = `
            DELETE FROM orders
            WHERE order_id = $1 AND order_status = 'expired'
        `;
        await pool.query(query, [orderId]);
        res.status(200).json({ message: 'Expired order deleted' });
    } catch (error) {
        console.error('Error deleting expired order:', error.message);
        res.status(500).json({ error: 'Failed to delete expired order' });
    }
}

const sendEmail = async (email, orderName, link, statusMessage) => {
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
    console.log(`Attempting to send email to: ${email}`);  // Log before sending
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Status Link',
      html: `
          <h3>Your order ${orderName} has been successfully ${statusMessage}!</h3>
          <p>Click <a href="${link}">here</a> to view your order status.</p>
      `
    });
    console.log(`Email successfully sent to: ${email}`);  // Log success
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error.message);  // Log specific error
  }
};


const updateOrderShipping = async(req, res) => {
    try {
        const {orderId } = req.params;
        const { trackingNumber, courier } = req.body;

        const query = `
            UPDATE orders
            SET tracking_number = $1, courier = $2
            WHERE order_id = $3
        `
        await pool.query(query, [trackingNumber, courier, orderId]);
        res.status(200).json({ message: 'Order shipping updated' });
    } catch (error) {
        console.error('Error updating order shipping:', error.message);
        res.status(500).json({ error: 'Failed to update order shipping' });
    }
}

const deductStockForCompletedOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Step 1: Retrieve all items in this order
        const orderItemsQuery = `
            SELECT item_id, item_qty 
            FROM order_items
            WHERE order_id = $1
        `;
        const orderItemsResult = await pool.query(orderItemsQuery, [orderId]);

        if (orderItemsResult.rows.length === 0) {
            return res.status(404).json({ error: 'No items found for this order' });
        }

        const orderItems = orderItemsResult.rows;

        // Step 2: Build the dynamic SQL for stock update
        let updateItemsStockCount = "UPDATE items SET stock_count = CASE item_id ";
        let updateItemsStockCountValues = [];
        let updateItemsStockCountWhereClause = "WHERE item_id IN (";

        for (let i = 0; i < orderItems.length; i++) {
            const item = orderItems[i];

            updateItemsStockCount += `WHEN '${item.item_id}' THEN stock_count - $${i + 1} `;
            updateItemsStockCountValues.push(item.item_qty);

            updateItemsStockCountWhereClause += `'${item.item_id}'`;
            if (i < orderItems.length - 1) {
                updateItemsStockCountWhereClause += ", ";
            } else {
                updateItemsStockCountWhereClause += ")";
            }
        }
        updateItemsStockCount += `ELSE stock_count END ${updateItemsStockCountWhereClause}`;

        // Begin transaction
        await pool.query("BEGIN");

        // Step 3: Execute the stock update
        await pool.query(updateItemsStockCount, updateItemsStockCountValues);

        // Commit transaction
        await pool.query("COMMIT");

        res.status(200).json({ message: 'Stock deducted and order marked as completed' });
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error deducting stock or completing order:", error.message);
        res.status(500).json({ error: 'Failed to deduct stock or complete the order' });
    }
};

const getOrderStatistics = async (req, res) => {
    const query = `
        SELECT
            COUNT(*) FILTER (WHERE DATE(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1) AS orders_today,
            COALESCE(SUM(order_amount) FILTER (WHERE DATE(date_created AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') = $1 AND payment_status = 'paid'), 0) AS total_sales_today,
            COUNT(*) AS total_orders,
            COALESCE(SUM(order_amount) FILTER (WHERE payment_status = 'paid'), 0) AS total_sales
        FROM orders;
    `;
    
    try {
        const { startDate } = req.params;
        const { rows } = await pool.query(query, [startDate]);
        res.status(200).json( { stats: rows[0] });
    } catch (error) {
        console.error('Error retrieving order statistics:', error.message);
        res.status(500).json({ error: 'Failed to retrieve order statistics' });
    }
};

module.exports = {
    getOrders,
    getOrdersItems,
    updateOrderStatus,
    updateOrderShipping,
    deductStockForCompletedOrder,
    getOrderDates,
    getOrderStatistics,
    getOrder,
    deleteExpiredOrder
}