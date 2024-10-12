const pool = require('../database/db'); 
const jwt = require('jsonwebtoken');

// Controller function to render the dashboard
const renderDashboard = async (req, res) => {
    try {
        // Fetch the user's favorite anime from the database using their user ID
        const favoriteAnime = await getFavoriteAnime(req.userInfo.id);
        console.log(req.userInfo);
        res.render('dashboard', {
            title: 'User Dashboard',
            favoriteAnime, // Pass the favorite anime to the view
        });
    } catch (error) {
        console.error('Error fetching favorite anime:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while fetching your favorite anime.',
        });
    }
};

// Function to fetch user's favorite anime from the database
const getFavoriteAnime = async (userId) => {
    const query = `
        SELECT a.id, a.anime_title 
        FROM anime a
        WHERE a.user_id = $1;`;

    const result = await pool.query(query, [userId]);
    return result.rows; // This should return the user's favorite anime
};

// Controller function to display the form for adding anime
const getAddAnime = (req, res) => {
    // Renders the "add anime" form view
    res.render('add-anime', {
        title: 'Add New Anime',
    });
};

// Controller function to handle the submission of the anime form
const postAddAnime = async (req, res) => {
    const { anime_title, description } = req.body; // Get anime title and description from the form
    const userId = req.userInfo.id; // Get user ID from JWT

    if (!anime_title || anime_title.trim() === "") {
        return res.status(400).render('error', {
            title: 'Error',
            message: 'Anime title is required.',
        });
    }

    try {
        // Insert the new anime and its description into the anime table
        const query = `
            INSERT INTO anime (user_id, anime_title, description)
            VALUES ($1, $2, $3);`;
        await pool.query(query, [userId, anime_title, description || null]); // If description is empty, insert null
        
        // Redirect back to dashboard after successful insertion
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error adding anime:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while adding the anime.',
        });
    }
};


module.exports = {
    renderDashboard,
    getAddAnime, // New function to render the form
    postAddAnime, // New function to handle form submission

};
