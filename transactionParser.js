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
/*
Fund BNZ2112007 Balanced Fund
Fund BNZ2112008 Growth Fund
Fund BNZ2112009 Balanced Growth Fund
Fund BNZ2112010 Moderate Fund
Fund BNZ2112011 Income Fund
*/
exports.getFundCodeFor = function (fundDescription) {
  switch (fundDescription) {
    case 'Balanced Fund':
      return 'BNZ2112007'
    case 'Growth Fund':
      return 'BNZ2112008'
    case 'Balanced Growth Fund':
      return 'BNZ2112009'
    case 'Moderate Fund':
      return 'BNZ2112010'
    case 'Income Fund':
      return 'BNZ2112011'
    default:
      console.error('Unknown fund description: ' + fundDescription)
      return null
  }
}
exports.getTransactionAmount = function (transaction) {
  return transaction.value.amount
}
