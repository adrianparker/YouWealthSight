/* eslint-disable no-undef */
var assert = require('assert')
var TransactionParser = require('../transactionParser')
var sampleTransactions = require('./transactions')
var sampleTransaction = require('./transaction')

describe('TransactionParser', function () {
  describe('#getCount()', function () {
    it('should return 0 for null json', function () {
      assert.strictEqual(TransactionParser.getCount(), 0)
    })
    it('should return 0 for empty object', function () {
      assert.strictEqual(TransactionParser.getCount({}), 0)
    })
    it('should return 34 for sample transactions json', function () {
      assert.strictEqual(TransactionParser.getCount(sampleTransactions), 34)
    })
  })
  describe('#getTransactions', function () {
    it('should return empty array for null json', function () {
      assert.notStrictEqual(TransactionParser.getTransactions(), [])
    })
    it('should return empty array for empty object', function () {
      assert.notStrictEqual(TransactionParser.getTransactions({}), [])
    })
    it('should return array of 34 objects for sample transactions json', function () {
      assert.strictEqual(TransactionParser.getTransactions(sampleTransactions).length, 34)
    })
    it('should return array of getCount() objects for sample transactions json', function () {
      assert.strictEqual(TransactionParser.getTransactions(sampleTransactions).length, TransactionParser.getCount(sampleTransactions))
    })
  })
  describe('#getPostedTransactions', function () {
    it('should return array of 0 objects for null json', function () {
      assert.strictEqual(TransactionParser.getPostedTransactions().length, 0)
    })
    it('should return array of 0 objects for empty object', function () {
      assert.strictEqual(TransactionParser.getPostedTransactions({}).length, 0)
    })
    it('should return array of 34 objects for sample transactions json', function () {
      assert.strictEqual(TransactionParser.getPostedTransactions(sampleTransactions).length, 34)
    })
  })
  describe('#getTransactionDate', function () {
    it('should return correct date for sample transaction', function () {
      assert.strictEqual(TransactionParser.getTransactionDate(sampleTransaction), '2019-03-07T00:00:00.000000')
    })
  })
  describe('#getTransactionId', function () {
    it('should return correct id for sample transaction', function () {
      assert.strictEqual(TransactionParser.getTransactionId(sampleTransaction), '8CO30C1G68OJ4CHJ60OJ8D9L6GPJ0E9OBT9J4C1H74MJ0CPD60RL8C1G78O30EHG60N30C1GFGMJ2D1K70SJGC1J70ONS')
    })
  })
  describe('#getTransactionFund', function () {
    it('should return correct fund for sample transaction', function () {
      assert.strictEqual(TransactionParser.getTransactionFund(sampleTransaction), 'Growth Fund')
    })
  })
  describe('#getTransactionAmount', function () {
    it('should return correct amount for sample transaction', function () {
      assert.strictEqual(TransactionParser.getTransactionAmount(sampleTransaction), '0.11')
    })
  })
})
