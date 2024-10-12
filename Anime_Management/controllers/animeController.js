const pool = require('../database/db');

// Function to render the edit anime page
const getEditAnime = async (req, res) => {
    const animeId = req.params.id;

    try {
        const anime = await getAnimeById(animeId);
        if (anime) {
            res.render('edit-anime', {
                title: 'Edit Anime',
                anime, // Pass the anime details to the view
            });
        } else {
            res.status(404).render('error', {
                title: 'Error',
                message: 'Anime not found.',
            });
        }
    } catch (error) {
        console.error('Error fetching anime:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while fetching the anime details.',
        });
    }
};

// Function to fetch an anime by ID
const getAnimeById = async (id) => {
    const query = `SELECT * FROM anime WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Return the anime object
};

// Function to handle editing an anime
const postEditAnime = async (req, res) => {
    const animeId = req.params.id;
    const { anime_title, description } = req.body;

    try {
        const query = `UPDATE anime SET anime_title = $1, description = $2 WHERE id = $3`;
        await pool.query(query, [anime_title, description, animeId]);
        res.redirect('/dashboard'); // Redirect to the dashboard after editing
    } catch (error) {
        console.error('Error updating anime:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while updating the anime.',
        });
    }
};

// Function to handle deleting an anime
const deleteAnime = async (req, res) => {
    const animeId = req.params.id;

    try {
        const query = `DELETE FROM anime WHERE id = $1`;
        await pool.query(query, [animeId]);
        res.redirect('/dashboard'); // Redirect to the dashboard after deleting
    } catch (error) {
        console.error('Error deleting anime:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred while deleting the anime.',
        });
    }
};

const getAnimeDescription = async (req, res) => {
    const animeId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM anime WHERE id = $1', [animeId]);

        if (result.rows.length > 0) {
            const anime = result.rows[0];
            res.render('anime-description', {
                title: `Description of ${anime.anime_title}`,
                anime, // Pass the anime data to the view
            });
        } else {
            res.status(404).send('Anime not found');
        }
    } catch (error) {
        console.error('Error fetching anime description:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getEditAnime,
    postEditAnime,
    deleteAnime,
    getAnimeDescription,
};
