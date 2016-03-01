'use strict';
var router = require('express').Router();
var Promise = require('bluebird');
var papaparse = Promise.promisify(require('papaparse').parse);
var readFile = Promise.promisify(require('fs').readFile);
module.exports = router;

router.get('/exoplanets', function(req, res) {
    readFile('planets.csv', 'utf-8')
        .then(function(data) {
            var parseData;
            papaparse(data, {
                complete: function(results) {
                    parseData = results;
                }
            });
            return parseData;
        })
        .then(function(results) {
            res.status(200).json(results);
        })
        .catch(function(e) {
            console.log("error reading file", e);
        });

});
