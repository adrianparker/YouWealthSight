/* eslint-disable no-undef */
var assert = require('assert')
var UnitPriceParser = require('../unitPriceParser')

describe('UnitPriceParser', function () {
  describe('#getPricesForDate()', function () {
    it('should return empty object for null date', function (done) {
      UnitPriceParser.getPricesForDate('apiKey', null, function (result) {}, function (error) {
        assert.strictEqual('Null or bad date', error)
        done()
      })
    })
    it('should return error for not a date', function (done) {
      UnitPriceParser.getPricesForDate('apiKey', 'notadate', function (result) {
      }, function (error) {
        assert.strictEqual('Null or bad date', error)
        done()
      })
    })
    it('should return valid fund price object for Date.now()', function (done) {
      UnitPriceParser.getPricesForDate(getApiKeyFromProcessArgs(), Date.now(), function (result) {
        assertValidFundPricesObject(result)
        done()
      }, function (error) {
        console.log(error)
      })
    })
    it('should return valid fund price object for 21 May 2018 (first date contributions accepted)', function (done) {
      UnitPriceParser.getPricesForDate(getApiKeyFromProcessArgs(), '2018-05-21', function (result) {
        assertValidFundPricesObject(result)
        done()
      }, function (error) {
        console.log(error)
      })
    })
  })
})

function getApiKeyFromProcessArgs () {
  for (var index in process.argv) {
    var str = process.argv[index]
    if (str.indexOf('--api_key') === 0) {
      return str.substr(10)
    }
  }
}

function assertValidFundPricesObject (result) {
  assert.strictEqual(Object.keys(result).length, 5)
  assert.strictEqual(Object.getOwnPropertyNames(result).includes('BNZ2112007'), true)
  assert.strictEqual(Object.getOwnPropertyNames(result).includes('BNZ2112008'), true)
  assert.strictEqual(Object.getOwnPropertyNames(result).includes('BNZ2112009'), true)
  assert.strictEqual(Object.getOwnPropertyNames(result).includes('BNZ2112010'), true)
  assert.strictEqual(Object.getOwnPropertyNames(result).includes('BNZ2112011'), true)
}
