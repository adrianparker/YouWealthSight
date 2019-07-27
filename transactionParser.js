exports.getCount = function (transactions) {
  return transactions && transactions.transactions ? transactions.transactions.length : 0
}
exports.getTransactions = function (transactions) {
  return transactions && transactions.transactions ? transactions.transactions : []
}
exports.getPostedTransactions = function (transactions) {
  var postedTransactions = []
  if (transactions && transactions.transactions) {
    transactions.transactions.forEach(element => {
      if (element.status.code === 'POSTED') {
        postedTransactions.push(element)
      }
    })
  }
  return postedTransactions
}
exports.getTransactionDate = function (transaction) {
  return transaction.timestamp
}
exports.getTransactionId = function (transaction) {
  return transaction.id
}
exports.getTransactionFund = function (transaction) {
  return transaction.thisAccount.details.particulars
}
exports.getTransactionAmount = function (transaction) {
  return transaction.value.amount
}
