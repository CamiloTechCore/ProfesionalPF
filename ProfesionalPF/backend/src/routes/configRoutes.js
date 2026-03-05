const express = require('express');
const router = express.Router();
const { updateIncomeConfig } = require('../controllers/configController');
const { getFinancialStatus } = require('../controllers/configController');

router.patch('/income-settings', updateIncomeConfig);
router.get('/trm', getFinancialStatus);

module.exports = router;