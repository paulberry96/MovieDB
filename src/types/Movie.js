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
                resolve(testData);
            }, 1000);
        });
    }
}

module.exports = Movie;