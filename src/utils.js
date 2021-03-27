const path = require('path');
const { getConfig } = require('./config');

function libPath(str) {
	return path.join(getConfig().libraryPath, str);
}

module.exports = {
	libPath: libPath
};