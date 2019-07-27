var sampleTransactions = require('./test/transactions')

exports.getTransactions = function (accountId) {
  console.log('Retrieving SAMPLE transactions for account ' + accountId)
  // TODO this will need to replace sampleTransactions with live transactions from account
  return sampleTransactions
}
