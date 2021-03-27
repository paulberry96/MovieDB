'use strict';

const fs = require('fs').promises;
const { getConfig } = require('./config');
const Movie = require('./types/Movie');
const ProcessingQueue = require('./processing');
const database = require('./db');

async function scanMovieList() {

    const config = getConfig();

    const movieListPath = config.movieListPath;

    console.log("--- Scanning: ", movieListPath);

    try {
        const movieList = (await fs.readFile(movieListPath, 'utf-8')).split(/\r?\n/);

        for(let i = 0; i < movieList.length; i++) {
            let movie = await Movie.getMovieByname(movieList[i]);
            if(!movie) {
                movie = {
                    _id: await database.getAutoId('movies'),
                    name: movieList[i],
                    processed: false
                };
                await database.insert(database.store.movies, movie);
                ProcessingQueue.append(movie);
            }
            else if(movie && !movie.processed)
                ProcessingQueue.append(movie);
        }

        if(config.processing.doProcessing) {
            ProcessingQueue.start();
        }
        else {
            console.log("--- Skipping Processing (Disabled in config)");
            return;
        }
    }
    catch(err) {
        if(err.code === "ENOENT") {
            console.log(movieListPath, " Does not exist.");
        }
        else {
            console.log(err);
        }
    }
}

module.exports = {
    scanMovieList: scanMovieList
};