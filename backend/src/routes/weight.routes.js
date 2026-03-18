// routes/weight.routes.js
const express = require('express');
const router = express.Router();
const { getLogs, createLog, deleteLog } = require('../controllers/weight.controller');
// const { authenticate } = require('../middleware/auth.middleware');

// router.use(authenticate);
router.get('/', getLogs);
router.post('/', createLog);
router.delete('/:id', deleteLog);

module.exports = router;
