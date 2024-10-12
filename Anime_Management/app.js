const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const animeRoutes = require('./routes/animeRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const port = 3000;

// Database Pool
const pool = require('./database/db');

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Serve static files from the public directory
app.use(express.static('public')); // Move this above the route definitions

// Route definitions
app.use('/', authRoutes); 
app.use('/dashboard', dashboardRoutes);
app.use('/', animeRoutes);

// EJS Setup
app.set('views', path.join(__dirname, 'views')); // Use path.join for better path handling
app.set('view engine', 'ejs');

// Test route to check server functionality
// Landing page route
app.get('/', (req, res) => {
    res.render('landing'); // Render the landing page EJS template
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
