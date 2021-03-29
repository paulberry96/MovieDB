'use strict';

const database = require('../db');

const fs = require('fs');

const testData = JSON.parse(fs.readFileSync('./testData.json', 'utf-8'));

class Movie {

    static async getAll() {
        return (await database.find(database.store.movies, {}));
    }

    static async getById(id) {
        return (await database.findOne(database.store.movies, { _id: id }));
    }

    static async getMovieByname(name) {
        return (await database.findOne(database.store.movies, { name: name }));
    }

    static async fetchMovieData() {
        return new Promise((resolve, reject) => {
            setTimeout(function() {

                if(!testData.hasOwnProperty('Response') || testData.Response === 'False') {
                    reject('no response');
                    return;
                }

                const returnData = Object.assign({}, testData);

                // Split Genres into array
                returnData.Genre = returnData.Genre.replace(/,\s+/g, ',').split(',');
                
                // Split Actors into array
                returnData.Actors = returnData.Actors.replace(/,\s+/g, ',').split(',');

                resolve(returnData);
            }, 200);
        });
    }
}

module.exports = Movie;