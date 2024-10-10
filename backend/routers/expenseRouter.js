const express = require('express');
const router = express.Router();
const upload = require("../middleware/imgUploadMiddleware"); 
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole')
const { 
    addExpense, 
    getExpenses,
    editExpense,
    getExpensesDates,
    archiveExpense
} = require("../controllers/expenseController");

router.post('/add-expense', verifyToken, checkRole('staff'), upload.single('image'), addExpense); 

router.get('/get-expenses/:startDate', verifyToken, checkRole('staff'), getExpenses);

router.put('/edit-expense/:id', verifyToken, checkRole('staff'), upload.single('image'), editExpense);

router.put('/archive-expense/:id', verifyToken, checkRole('staff'), archiveExpense);

router.get('/get-expenses-dates', verifyToken, checkRole('staff'), getExpensesDates);

module.exports = router;
