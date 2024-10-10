const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole')
const {
  getAllItems,
  getAllMechanics,
  confirmSale
} = require("../controllers/posController");

router.get("/get-items", verifyToken, checkRole('staff'), getAllItems);

router.get("/get-mechanics", verifyToken, checkRole('staff'), getAllMechanics);

router.post("/confirm-sale", verifyToken, checkRole('staff'), confirmSale);

module.exports = router;