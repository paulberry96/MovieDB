'use strict';

const fs = require('fs').promises;
const path = require('path');

const DEFAULT_CONFIG = {
    "movieListPath": path.join(process.cwd(), 'MovieList.txt'),
    "libraryPath": path.join(process.cwd(), 'library'),
    "processing": {
        "doProcessing": true
    }
}

const configFile = path.join(process.cwd(), 'config.json');

let loadedConfig;

async function loadConfig() {
    try {
        loadedConfig = JSON.parse(await fs.readFile(configFile, 'utf-8'));
        console.log("--- Config Loaded");
    }
    catch(err) {
        if(err.code === 'ENOENT') {
            console.log("!!! CONFIG NOT FOUND - CREATING");
            loadedConfig = DEFAULT_CONFIG;
            await fs.writeFile(configFile, JSON.stringify(loadedConfig, null, 4));
            console.log("--- Config Created");
        }
    }
}

function getConfig() {
    return loadedConfig;
}

module.exports = {
    loadConfig: loadConfig,
    getConfig: getConfig
};