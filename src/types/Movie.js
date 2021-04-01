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
        const config = getConfig();

        if(!config.API_KEY) {
            throw { continue: false, message: "No API key provided." };
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

        const response = await fetch(url);
        let movieData = await response.json();

        if(movieData.hasOwnProperty('Response') && movieData.Response === 'True') {

            movieData = Movie.parseMovieData(movieData);

            movieData.thumbnail = await Movie.saveThumbnail(movieData.Poster, `${movieData.imdbID}.jpg`)
                .catch(_ => '');

            return movieData;
        }
        else {
            if(movieData.hasOwnProperty('Error') && movieData.Error === 'Invalid API key!')
                throw { continue: false, message: "Invalid API key" };
            else
                throw { continue: true, message: "No Response." };
        }
    }

    static async saveThumbnail(url, fileName) {
        if(url === '')
            return "";

        const response = await fetch(url);
        const filePath = path.join(libPath('thumbs'), fileName);
        const fileStream = fs.createWriteStream(filePath);

        return await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on("error", reject);
            fileStream.on("finish", () => {
                resolve(fileName);
            });
        });
    }

    static parseMovieData(data) {
        const movieData = Object.assign({}, data);
        const arrayKeys = ['Actors', 'Country', 'Director', 'Genre', 'Language', 'Writer'];
        for(let key in movieData) {
            if(!movieData.hasOwnProperty(key)) continue;

            // Parse to string
            if(arrayKeys.indexOf(key) === -1) {
                movieData[key] = (movieData[key] !== 'N/A') ? movieData[key] : "";
            }
            // Parse to array
            else {
                movieData[key] = (movieData[key] !== 'N/A') ? movieData[key].replace(/(\s?)+,(\s?)+/g, ',').split(',') : [];
            }
        }

        return movieData;
    }
}

module.exports = Movie;