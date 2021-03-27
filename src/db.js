'use strict';

const path = require('path');
const DataStore = require('nedb');
const { libPath } = require('./utils');

let store = {
    movies: null,
    autoIncrement: null
};

function loadStore(path) {
    return new Promise((resolve, reject) => {
        const store = new DataStore({
            autoload: true,
            filename: path,
            onload: (err) => {
                if(err) reject(err);
                else resolve(store);
            }
        });
    });
}

async function loadStores() {
    try {
        Object.assign(store, {
            movies: await loadStore(path.join(libPath('db'), 'Movies.db')),
            autoIncrement: await loadStore(path.join(libPath('db'), 'AutoIncrement.db'))
        });

        store.movies.ensureIndex({ fieldName: '_id', unique: true });
        store.movies.ensureIndex({ fieldName: 'name', unique: true });
        store.autoIncrement.ensureIndex({ fieldName: 'store', unique: true });
        store.autoIncrement.insert({ store: 'movies', value: 0 });

        console.log("--- Database Loaded");
    }
    catch(err) {
        console.log(err);
    }
}

function find(store, query) {
    return new Promise((resolve, reject) => {
        store.find(query, (err, doc) => {
            if(err) reject(err);
            else resolve(doc);
        });
    });
}

function findOne(store, query) {
    return new Promise((resolve, reject) => {
        store.findOne(query, (err, doc) => {
            if(err) reject(err);
            else resolve(doc);
        });
    });
}

function insert(store, doc) {
    return new Promise(function(resolve, reject) {
        store.insert(doc, function(err, doc) {
            if(err) reject(err);
            else resolve(doc);
        });
    });
}

function update(store, query, update) {
    return new Promise((resolve, reject) => {
        store.update(query, update, { multi: true }, err => {
            if(err) reject(err);
            else resolve();
        });
    });
}

function remove(store, query) {
    return new Promise((resolve, reject) => {
        store.remove(query, (err) => {
            if(err) reject(err);
            else resolve();
        });
    });
}

function count(store, query) {
    return new Promise((resolve, reject) => {
        store.count(query, (err, count) => {
            if(err) reject(err);
            else resolve(count);
        });
    });
}

function getAutoId(storeName) {
    return new Promise((resolve, reject) => {
        store.autoIncrement.update(
            { store: storeName },
            { $inc: { value: 1 } },
            { upsert: true, returnUpdatedDocs: true },
            function(err, numAffected, autoid) {
                if(err) reject(err);
                else resolve(autoid.value);
            }
        );
    });
}

module.exports = {
    store: store,
    loadStores: loadStores,
    find: find,
    findOne: findOne,
    insert: insert,
    update: update,
    remove: remove,
    count: count,
    getAutoId: getAutoId
};