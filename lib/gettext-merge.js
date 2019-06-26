/*
    wrapper for gettext-merge by @brunobertolini (https://www.npmjs.com/package/gettext-merge)
*/

const fs = require('fs');
const gettextParser = require('gettext-parser');
const log = require('fancy-log');

const gettextMerge = (poFile, potFile, options) => {

    const po = gettextParser.po.parse(fs.readFileSync(poFile));
    const pot = gettextParser.po.parse(fs.readFileSync(potFile));
    const keys = Object.keys(pot.translations['']);

    if (typeof options === "undefined") {
        options = {};
    }

    for (var i = 1; i < keys.length; i++) {
        if (po.translations[''][keys[i]]) {
            pot.translations[''][keys[i]]['msgstr'] = po.translations[''][keys[i]]['msgstr'];

            if (po.translations[''][keys[i]].comments.reference !== pot.translations[''][keys[i]].comments.reference) {
                var comments = {
                    changes: [],
                    out: po.translations[''][keys[i]].comments.reference.split('\n'),
                    in: pot.translations[''][keys[i]].comments.reference.split('\n')
                };

                comments.out.forEach(function(item) {
                    if (comments.in.indexOf(item) === -1) {
                        comments.changes.push('- ' + item);
                    }
                });

                comments.in.forEach(function(item) {
                    if (comments.out.indexOf(item) === -1) {
                        comments.changes.push('+ ' + item);
                    }
                });

                if (comments.changes.length && (!options.show || options.show === 'change') ) {
                    log.warn('[CHANGE] ' + keys[i]);
                    comments.changes.map(function(item) {
                        log.info(item);
                    });
                }
            }
        } else if ((!options.show || options.show === 'add')) {
            log.warn('[ADD] ' + keys[i]);
            if (pot.translations[''][keys[i]].comments) {
                log(pot.translations[''][keys[i]].comments.reference);
            }
        }
    }

    pot.headers = po.headers;
    return gettextParser.po.compile(pot);
}

module.exports = gettextMerge;