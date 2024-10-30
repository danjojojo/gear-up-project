const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const multer = require('multer'); 
const upload = multer();
const {
    getAllMechanics,
    addMechanic,
    editMechanic,
    changeMechanicStatus,
    deleteMechanic
} = require('../controllers/mechanicsController');

router.get('/get-mechanics', verifyToken, checkRole('admin'), getAllMechanics);

router.post('/add-mechanic', verifyToken, checkRole('admin'), upload.none(), addMechanic);

router.put('/edit-mechanic/:id', verifyToken, checkRole('admin'), upload.none(), editMechanic);

router.put('/change-mechanic-status/:id', verifyToken, checkRole('admin'), changeMechanicStatus);

router.put('/delete-mechanic/:id', verifyToken, checkRole('admin'), deleteMechanic);

module.exports = router;