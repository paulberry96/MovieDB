'use strict';

const database = require('../db');

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
            resolve('test');
        });
    }
}

module.exports = Movie;