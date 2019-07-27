#!/usr/bin/env node

/**
 * Maintain BNZ YouWealth managed fund transactions in a Sharesight portfolio.
 */

var argv = require('argv')
var TransactionFetcher = require('./transactionFetcher')
var TransactionParser = require('./transactionParser')
var UnitPriceFetcher = require('./unitPriceFetcher')
var UnitPriceParser = require('./unitPriceParser')

var postedTransactions
var clientId
var accountId
var apiKey

function start () {
  var pjson = require('./package.json')
  var args
  console.log('YouWealthSight v ' + pjson.version)
  argv.version(pjson.version)
  argv.option({
    name: 'client_id',
    short: 'c',
    type: 'string',
    description: 'ShareSight Client ID',
    example: "'YouWealthSight --client_id=FOO' or 'YouWealthSight -c BAR'"
  })
  argv.option({
    name: 'account_id',
    short: 'a',
    type: 'string',
    description: 'YouWealth Account ID',
    example: "'YouWealthSight --account_id=FOO' or 'YouWealthSight -a BAR'"
  })
  argv.option({
    name: 'api_key',
    short: 'k',
    type: 'string',
    description: 'BNZ API Key',
    example: "'YouWealthSight --api_key=FOO' or 'YouWealthSight -k BAR'"
  })
  args = argv.run()
  if (Object.getOwnPropertyNames(args.options).length === 0) {
    console.log('No command line options supplied.')
    process.exit(1)
  } else if (Object.getOwnPropertyNames(args.options).length === 1 && args.options.api_key !== null) {
    apiKey = args.options.api_key
    fetchLatestYouWealthPrices()
  } else if ((Object.getOwnPropertyNames(args.options).length !== 3) ||
    (args.options.client_id === null) ||
    (args.options.api_key === null) ||
    (args.options.account_id === null)) {
    console.log('Please provide all command line options, or none for latest prices.')
    argv.help()
    process.exit(1)
  } else {
    clientId = args.options.client_id
    apiKey = args.options.api_key
    accountId = args.options.account_id
    updateShareSight(accountId, clientId, apiKey)
  }
}

function updateShareSight (youWealthAccountId, clientId, apiKey) {
  // get transactions from BNZ for youWealthAccountId
  console.log('Retrieving transactions for YouWealth account ID: ' + youWealthAccountId)
  var transactions = TransactionFetcher.getTransactions(youWealthAccountId)
  postedTransactions = TransactionParser.getPostedTransactions(transactions)
  console.log('Got posted transaction count: ' + postedTransactions.length)
  if (postedTransactions.length > 0) {
    // for each transaction, get unit prices for its transaction date
    var postedDates = []
    postedTransactions.forEach(element => {
      var thisPostedTransactionDate = TransactionParser.getTransactionDate(element)
      if (postedDates.indexOf(thisPostedTransactionDate) < 0) {
        postedDates.push(thisPostedTransactionDate)
      }
    })
    console.log('Unit prices required for date count: ' + postedDates.length)
    UnitPriceFetcher.getUnitPricesForDates(apiKey, postedDates, processTransactionsIntoSharesight)
  }
}

function processTransactionsIntoSharesight (unitPrices) {
  if (unitPrices && Object.keys(unitPrices).length > 0) {
    console.log('Unit prices returned: ' + Object.keys(unitPrices).length)
    console.log('Processing for ShareSight client ID: ' + clientId)
    // get from ShareSight the list of user's portfolios
    // then get user to specify which portfolio to create YouWealth in
    // in batches of 500 max
    // create a trade for each transaction, using transaction id as unique_identifier, fundCode as symbol, OTHER as market
    var trades = []
    postedTransactions.forEach(element => {
      trades.push({
        'transaction_id': TransactionParser.getTransactionId(element),
        'fundCode': TransactionParser.getFundCodeFor(TransactionParser.getTransactionFund(element)),
        'market': 'OTHER'
      })
    })
    console.log('Processed trade count ' + trades.length)
  } else {
    console.log('Cannot process transactions, no unit prices available')
    process.exit(1)
  }
}

function fetchLatestYouWealthPrices () {
  console.log('Fetching latest YouWealth prices:')
  UnitPriceParser.getPricesForDate(apiKey, Date.now(), function (prices) {
    Object.keys(prices).forEach(function (key, index) {
      var price = prices[key]
      console.log(key + ' ' + String(price.fundName).padEnd(24, ' ') + ' as at ' + price.date + ' : BUY ' + price.buyPrice.amount + ' : SELL ' + price.sellPrice.amount)
    })
  })
}

start()
