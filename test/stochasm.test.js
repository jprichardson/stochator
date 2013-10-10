var should = require('should')
  , stochasm = require('../lib/stochasm')
  , u = require('./util')
  , _ = require('lodash')
  , cs = require('chi-square')

var SAMPLE_SIZE = 10000//00

describe('+ stochasm', function() {
  describe('> when no parameters', function() {
    it('should create a function that generates values between 0.0 and 1.0', function() {
      var generator = stochasm()
      var vals = []
      for (var i = 0; i < SAMPLE_SIZE; ++i) {
        vals.push(generator.next())
      }

      u.mean(vals).should.be.approximately(0.5, 0.1)
      _(vals).min().should.be.approximately(0, 0.1)
      _(vals).max().should.be.approximately(1, 0.1)

      var newVals = generator.next(SAMPLE_SIZE)
      newVals.length.should.eql(SAMPLE_SIZE)
    })
  })

  describe('> when min/max interval parameters are passed', function() {
    it('should create a function that generates values between the min and max', function() {
      var generator = stochasm({min: -Math.PI, max: 2 * Math.PI})
      var vals = []
      for (var i = 0; i < SAMPLE_SIZE; ++i) {
        vals.push(generator.next())
      }

      u.mean(vals).should.be.approximately(Math.PI / 2, 0.1)
      _(vals).min().should.be.approximately(-Math.PI, 0.1)
      _(vals).max().should.be.approximately(2 * Math.PI, 0.1)
    })
  })

  describe('> when min, max, mean, and stddev parameters are passed', function() {
    it('should create a function that generates values governed by the normal distribuation', function() {
      var sd = 14
      var m = 75

      var generator = stochasm({mean: m, stdev: sd, min: 0, max: 100})
      var vals = []
      for (var i = 0; i < SAMPLE_SIZE; ++i) {
        vals.push(generator.next())
      }

      u.mean(vals).should.be.approximately(75, 1)
      u.stdev(vals).should.be.approximately(14, 1)
      _(vals).min().should.be.approximately(0, 2*sd)
      _(vals).max().should.be.approximately(100, 1)

    })
  })

  //will probably remove the ability to use "kinds" and to use custom named functions
  describe('> when the kind is an integer', function() {
    it('should create a function that generates bounded integers', function() {
      var generator = stochasm({kind: "integer", min: 1, max: 6}, 'roll')
      var vals = []
      for (var i = 0; i < SAMPLE_SIZE; ++i) {
        vals.push(generator.roll())
      }
 
      _.min(vals).should.equal(1) 
      _.max(vals).should.equal(6)

      //is it a fair die? hehehe
      var counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6:0}
      vals.forEach(function(n) {
        counts[n] += 1
      })

      Object.keys(counts).forEach(function(n) {
        var count = counts[n]
        count.should.be.approximately(SAMPLE_SIZE / 6, SAMPLE_SIZE*0.01)
      })
    })
  })
})