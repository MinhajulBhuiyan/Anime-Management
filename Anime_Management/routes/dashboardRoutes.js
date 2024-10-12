// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Middleware to check if the user is authenticated
const authMiddleware = require('../middlewares/authMiddleware');

// Dashboard route
router.get('/', authMiddleware, dashboardController.renderDashboard);
// Route to render the add anime form, protected by authMiddleware
router.get('/add-anime', authMiddleware, dashboardController.getAddAnime);
// Route to handle the form submission, protected by authMiddleware
router.post('/add-anime', authMiddleware, dashboardController.postAddAnime);



module.exports = router;
