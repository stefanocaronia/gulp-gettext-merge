const gettextMerge = require('./lib/gettext-merge');
const map = require('map-stream');

const gulpPoSync = (potFile) => {
	return map(function(file, cb){
        file.contents = gettextMerge(file.path, potFile);
		cb(false, file);
	});
}

module.exports = gulpPoSync;