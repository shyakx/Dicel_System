const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

router.get('/', payrollController.getAllPayrolls);
router.get('/:id', payrollController.getPayrollById);

module.exports = router; 