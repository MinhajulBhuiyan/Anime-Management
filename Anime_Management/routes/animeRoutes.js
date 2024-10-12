const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const animeController = require('../controllers/animeController.js');

// Route to get the edit anime form
router.get('/edit/:id', authMiddleware, animeController.getEditAnime);

// Route to handle the edit anime form submission
router.post('/edit/:id', authMiddleware, animeController.postEditAnime);

// Route to handle the delete anime action
router.post('/delete/:id', authMiddleware, animeController.deleteAnime);

router.get('/description/:id', animeController.getAnimeDescription);


module.exports = router;
