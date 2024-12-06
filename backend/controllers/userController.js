const pool = require('../config/db');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res) => {
    try {
        const { credential } = req.body;
        console.log(credential);

        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credential.access_token}`, {
                            headers: {
                                Authorization: `Bearer ${credential.access_token}`,
                                Accept: 'application/json'
                            }
                        });

        console.log(response.data);

        const { id, email, name, picture } = response.data;

        const userQuery = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);

        const token = jwt.sign({ id: id, email: email, name: name}, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(userQuery.rows);

        if(userQuery.rows.length === 0){
            const insertQuery = `
                INSERT INTO users (google_id, email, name, profile_picture)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `
            const newUser = await pool.query(insertQuery, [ id, email, name, picture ]);
            res.cookie('token', token, { 
                httpOnly: true, 
                sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'None',
                secure: process.env.NODE_ENV === 'production' ? true : true
            });
            return res.status(201).json({ user: newUser.rows[0] });
        } else {
            const existingUser = userQuery.rows[0];
            res.cookie('token', token, { 
                httpOnly: true, 
                sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'None',
                secure: process.env.NODE_ENV === 'production' ? true : true
            });
            return res.status(200).json({ user: existingUser });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const token = req.cookies.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userQuery = await pool.query('SELECT * FROM users WHERE google_id = $1', [decoded.id]);

        if(userQuery.rows.length === 0){
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user: userQuery.rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', { 
                httpOnly: true, 
                sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'None',
                secure: process.env.NODE_ENV === 'production' ? true : true
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrderHistory = async (req, res) => {
    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const orderQuery = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY date_created DESC', [decoded.id]);

        res.status(200).json({ orders: orderQuery.rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const submitReview = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // This should show name, amount, and pos
        console.log("Request File:", req.file); // This should show the image file if uploaded
        
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const { itemId, reviewRating, reviewText } = req.body;
        const reviewImage = req.file ? req.file.buffer : null;

        console.log(itemId, reviewRating, reviewText, reviewImage);
        
        // INSERT TO REVIEWS
        const insertQuery = `
            INSERT INTO reviews (user_id, item_id, rating, comment, image)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `
        const insertValues = [
            userId,
            itemId,
            reviewRating,
            reviewText,
            reviewImage
        ];
        const { rows } = await pool.query(insertQuery, insertValues);

        // UPDATE ORDER_ITEMS
        const retrievedReviewId = rows[0].review_id;

        const updateQuery = `
            UPDATE order_items
            SET review_id = $1
            WHERE item_id = $2
        `

        const updateValues = [
            retrievedReviewId,
            itemId
        ];

        await pool.query(updateQuery, updateValues);

        // UPDATE ITEMS
        const updateItemQuery = `
            UPDATE items
            SET total_rating = total_rating + $2, reviews_count = reviews_count + 1
            WHERE item_id = $1
        `
        await pool.query(updateItemQuery, [itemId, reviewRating]);

        res.status(200).json({ message: 'Review submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    loginUser,
    logoutUser,
    getProfile,
    getOrderHistory,
    submitReview
}