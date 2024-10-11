const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const multer = require('multer'); 
const upload = multer();
const {
    getAllMechanics,
    addMechanic
} = require('../controllers/mechanicsController');

router.get('/get-mechanics', verifyToken, checkRole('admin'), getAllMechanics);

router.post('/add-mechanic', verifyToken, checkRole('admin'), upload.none(), addMechanic);

module.exports = router;