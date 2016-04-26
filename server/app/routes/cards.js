var router = require('express').Router();
var cards = require('./cardGenerator');

module.exports = router;

router.get('/', (req,res,next) => {
  res.status(200).json(cards);
});

