'use strict';
var router = require('express').Router();
var Promise = require('bluebird');
var readFile = Promise.promisify(require('fs').readFile);
module.exports = router;

router.get('/', function(req, res) {
    readFile('Dan_Labrie_Resume.pdf')
        .then(function(results) {
            res.status(200).send(results);
        })
        .catch(function(e) {
            console.log("error reading file", e);
        });

});
