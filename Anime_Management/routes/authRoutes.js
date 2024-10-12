const express = require('express');
const router = express.Router();
const { renderSignupPage, signupUser , renderLoginPage, loginUser} = require('../controllers/authController');

// Render signup page
router.get('/signup', renderSignupPage);

// Handle signup form submission
router.post('/signup', signupUser);

// Route to render the login page
router.get('/login', renderLoginPage);

// Route to handle login submission
router.post('/login', loginUser);


module.exports = router;
