'use strict';

const fs = require('fs');
const Movie = require('./types/Movie');
const database = require('./db');

let queue = [];
let isProcessing = false;
let numProcessed = 0;

function append(item) {
    queue.push(item);
}

async function process(item) {

    const movieData = await Movie.fetchMovieData();

    const total = (queue.length + numProcessed) + 1;
    numProcessed++;

    console.log(`--- (${numProcessed}/${total}) Processed - ${item.name}`);
}

function start() {
    if(!isProcessing)
        processLoop();
}

async function processLoop() {

    if(isProcessing) return;

    isProcessing = true;

    let item = queue.shift();

    while(!!item) {
        try {
            await process(item);
        }
        catch(error) {
            logger.warn("Error processing video:", error.message);
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