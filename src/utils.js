const fs = require('fs');
const path = require('path');
const { getConfig } = require('./config');

function libPath(str) {
	return path.join(getConfig().libraryPath, str);
}

function createLibPaths(paths) {
	for(let i = 0; i < paths.length; i++) {
		const dir = libPath(paths[i]);
		try {
			fs.mkdirSync(dir, { recursive: true });
		}
		catch(err) {
			if(err.code === "EEXIST")
				console.log(`${dir} already exists`);
		}
	}
}

module.exports = {
	libPath: libPath,
	createLibPaths: createLibPaths
};