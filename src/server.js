const express = require('express');
const path = require('path');
const { loadConfig } = require('./config');
const { loadStores } = require('./db');
const { scanMovieList } = require('./scan');

(async function() {

	const app = express();
	const port = 2424;

	try {
		app.get('/', function(req, res) {
			res.sendFile(path.join(process.cwd(), 'app', 'index.html'));
		});

		// app.use('/api', api);

		await loadConfig();

		app.listen(port);

		await loadStores();
		await scanMovieList();
	}
	catch(err) {
		console.log(err);
	}
})();