const express = require('express');
const path = require('path');
const api = require('./api');
const { loadConfig } = require('./config');
const { createLibPaths, libPath } = require('./utils');
const { loadStores } = require('./db');
const { scanMovieList } = require('./scan');

(async function() {

	const app = express();
	const port = 2424;

	try {
		await loadConfig();
		createLibPaths(['db', 'thumbs']);

		app.get('/', function(req, res) {
			res.sendFile(path.join(process.cwd(), 'app', 'index.html'));
		});
		app.use('/thumbs', express.static(libPath('thumbs')));
		app.use('/api', api);
		app.listen(port);
		
		await loadStores();
		await scanMovieList();
	}
	catch(err) {
		console.log(err);
	}
})();