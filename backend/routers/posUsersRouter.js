const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const multer = require('multer');
const upload = multer();
const {
    getPosUsers,
    addPosUser,
    editPosUserName,
    editPosUserPassword,
    editPosUserStatus,
    deletePosUser,
    getPosUsersLogs,
    getPosLogsDates
} = require('../controllers/posUsersController');

router.get('/get-pos-users', verifyToken, checkRole('admin'), getPosUsers);

router.post('/add-pos-user', verifyToken, checkRole('admin'), upload.none(), addPosUser);

router.put('/edit-pos-name/:id', verifyToken, checkRole('admin'), upload.none(), editPosUserName);

router.put('/edit-pos-pass/:id', verifyToken, checkRole('admin'), upload.none(), editPosUserPassword);

router.put('/edit-pos-status/:id', verifyToken, checkRole('admin'), editPosUserStatus);

router.put('/delete-pos-user/:id', verifyToken, checkRole('admin'), upload.none(), deletePosUser);

router.get('/get-logs', getPosUsersLogs);

router.get('/get-logs-dates', getPosLogsDates);

module.exports = router;