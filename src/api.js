const express = require('express');
const router = express.Router();
const Movie = require('./types/Movie');

router.get('/movies', async function(req, res) {
    const movies = await Movie.getAll();
    res.json(movies);
});

module.exports = router;