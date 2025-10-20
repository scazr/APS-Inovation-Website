const express = require('express');
const { handleFormSubmit, renderForm } = require('../controllers/formController');
const upload = require('../middleware/upload');
const formValidation = require('../middleware/validation');
const rateLimiter = require('../config/rateLimit');

const router = express.Router();
router.get('/form', renderForm);
router.post('/submit-form', rateLimiter, upload.single('resume'), formValidation, handleFormSubmit);

module.exports = router;