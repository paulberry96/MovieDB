'use strict';

const database = require('../db');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { getConfig } = require('../config');
const { libPath } = require('../utils');

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

    static async fetchMovieData(movieName) {
        return new Promise(async (resolve, reject) => {
            const config = getConfig();

            if(!config.API_KEY) {
                reject({ continue: false, message: "No API key provided." });
                return;
            }

            const params = {
                type: "movie",
                plot: "full",
                apikey: config.API_KEY
            };

            // Try to parse name into format: Title (Year)
            let regexp = /^(.+)\s?(?:\((\d{4})\))/;
            let matches = movieName.match(regexp);

            if(matches) {
                params.t = matches[1].trim();
                params.y = matches[2].trim();
            }
            else {
                params.t = movieName.trim();
            }

            let url = "http://www.omdbapi.com/";
            url += '?' + (new URLSearchParams(params).toString());

            console.log("fetching: ", url);

            const response = await fetch(url);
            const data = await response.json();

            if(data.hasOwnProperty('Response') && data.Response === 'True') {

                // Split Genres into array
                data.Genre = data.Genre.replace(/,\s+/g, ',').split(',');

                // Split Actors into array
                data.Actors = data.Actors.replace(/,\s+/g, ',').split(',');

                resolve(data);
            }
            else {
                if(data.hasOwnProperty('Error') && data.Error === 'Invalid API key!') {
                    reject({ continue: false, message: "Invalid API key" });
                }
                else {
                    reject(data);
                }
            }
        });
    }

    static async saveMoviePoster(movieData) {
        return new Promise(async (resolve, reject) => {
            if(movieData.hasOwnProperty('Poster') && movieData.Poster != "") {
                const response = await fetch(movieData.Poster);
                const filePath = path.join(libPath('thumbs'), `${movieData.imdbID}.jpg`);
                const fileStream = fs.createWriteStream(filePath);

                response.body.pipe(fileStream);
                response.body.on("error", reject);
                fileStream.on("finish", resolve);
            }
        });
    }
}

module.exports = Movie;