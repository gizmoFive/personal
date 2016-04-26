'use strict';
var expect = require('chai').expect;
var cards = require('./cardGenerator');

describe('cardGenerator', function() {
  describe('cards', function () {
    it('should return cards as an array', function () {
     let cardset = cards.slice();
     expect(Array.isArray(cardset)).to.equal(true)
    });
    it('should return the appropriate # of cards', function() {
      let cardset = cards.slice();
      expect(cardset.length).to.equal(81)
    })
  });
});
