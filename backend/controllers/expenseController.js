const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const getExpenses = async (req, res) => {
    try {
        const { startDate } = req.params;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;

        const query = `
            SELECT
                expense_id,
                expense_name,
                expense_amount,
                encode(expense_image, 'base64') AS expense_image,
                date_created,
                date_updated 
            FROM expenses
            WHERE pos_id = $1 and DATE(date_updated) = $2 and status = 'active'
            ORDER BY date_updated DESC
        `;

        const values = [posId.toString(), startDate];

        const { rows } = await pool.query(query, values);

        res.status(201).json({ expenses: rows });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}

const addExpense = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // This should show name, amount, and pos
        console.log("Request File:", req.file); // This should show the image file if uploaded

        const { name, amount } = req.body;
        const image = req.file ? req.file.buffer : null;

        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ error: "No token provided" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;
        const expenseId = "expense-" + uuidv4();

        const query = `
            INSERT INTO expenses(expense_id, pos_id, expense_name, expense_amount, expense_image)
            VALUES ($1, $2, $3, $4, $5)
        `;

        const values = [
            expenseId,
            posId.toString(),
            name,
            amount,
            image
        ];
        
        const { rows } = await pool.query(query, values);

        res.status(201).json({ message: 'Success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

const editExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount } = req.body;
        const image = req.file ? req.file.buffer : null;

        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ error: "No token provided" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;
        
        const query = `
            UPDATE expenses
            SET expense_name = $1, expense_amount = $2, expense_image = $3, date_updated = NOW()
            WHERE expense_id = $4 AND pos_id = $5
        `;

        const values = [
            name,
            amount,
            image,
            id,
            posId.toString()
        ];
        
        await pool.query(query, values);

        res.status(201).json({ message: 'Success' });
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

const getExpensesDates = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if(!token){
            return res.status(401).json({ error: "No token provided" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;

        const query = `
            SELECT DISTINCT DATE(date_updated) AS date_updated
            FROM expenses
            WHERE pos_id = $1 and status = 'active'
            ORDER BY date_updated DESC
        `;

        const values = [
            posId.toString()
        ];
        
        const { rows } = await pool.query(query, values);
        res.status(201).json({ dates: rows });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}

const archiveExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.cookies.token;
        
        if(!token){
            return res.status(401).json({ error: "No token provided" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const posId = decodedToken.pos_id;

        const query = `
            UPDATE expenses
            SET status = 'archived'
            WHERE expense_id = $1 and pos_id = $2
        `;

        const values = [
            id,
            posId.toString()
        ];

        await pool.query(query, values);

        res.status(201).json({ message: 'Success' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    addExpense,
    getExpenses,
    editExpense,
    getExpensesDates,
    archiveExpense
}