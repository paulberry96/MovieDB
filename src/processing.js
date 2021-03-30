'use strict';

const Movie = require('./types/Movie');
const database = require('./db');

let queue = [];
let isProcessing = false;
let numProcessed = 0;

function append(item) {
    queue.push(item);
}

async function process(item) {
    return new Promise(async (resolve, reject) => {

        let movieData;

        try {
            movieData = await Movie.fetchMovieData(item.name);

            await Movie.saveMoviePoster(movieData);
        }
        catch(err) {
            reject(err);
            return;
        }

        const movie = Object.assign(item, movieData);

        movie.processed = true;
        movie.dateProcessed = Date.now();

        await database.update(database.store.movies, { _id: movie._id }, movie);

        numProcessed++;
        const total = (queue.length + numProcessed);
        console.log(`--- (${numProcessed}/${total}) Processed - ${movie.name}`);

        resolve();
    });
}

function start() {
    if(!isProcessing)
        processLoop();
}

async function processLoop() {

    if(isProcessing) return;

    isProcessing = true;

    console.log(`--- Ready to process ${queue.length} movies`);

    let item = queue.shift();

    while(!!item) {
        try {
            await process(item);
        }
        catch(err) {
            if(err.continue === false) {
                console.log("Error", err.message);
                break;
            }
            else {
                console.warn(err);
            }
        }
        item = queue.shift();
    }

    console.log("--- DONE PROCESSING ---");

    isProcessing = false;
}

module.exports = {
    append: append,
    start: start
};