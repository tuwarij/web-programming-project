// routes/food.routes.js
const express = require('express');
const router = express.Router();
const { getLogs, createLog, updateLog, deleteLog } = require('../controllers/food.controller');
// const { authenticate } = require('../middleware/auth.middleware');

// router.use(authenticate);
router.get('/', getLogs);
router.post('/', createLog);
router.put('/:id', updateLog);
router.delete('/:id', deleteLog);

module.exports = router;
