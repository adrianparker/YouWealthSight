#!/usr/bin/env node

/**
 * Maintain BNZ YouWealth managed fund transactions in a Sharesight portfolio.
 */
const argv = require('argv')
const Sharesight = require('./sharesight')
const TransactionFetcher = require('./transactionFetcher')
const TransactionParser = require('./transactionParser')
const UnitPriceFetcher = require('./unitPriceFetcher')
const UnitPriceParser = require('./unitPriceParser')
const PackageJSON = require('./package.json')
const trades = []
let postedTransactions
let clientId
let clientSecret
let accountId
let apiKey

/**
 * Examines command line arguments provided and if valid, executes the application accordingly.
 * Any mis-invocation reported to console and program exits.
 */
function start () {
  console.log('YouWealthSight ', PackageJSON.version)
  argv.version(PackageJSON.version)
  argv.option({
    name: 'client_id',
    short: 'c',
    type: 'string',
    description: 'ShareSight Client ID',
    example: "'YouWealthSight --client_id=FOO' or 'YouWealthSight -c BAR'"
  })
  argv.option({
    name: 'client_secret',
    short: 's',
    type: 'string',
    description: 'ShareSight Client Secret',
    example: "'YouWealthSight --client_secret=FOO' or 'YouWealthSight -s BAR'"
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
  let args = argv.run()
  if (Object.getOwnPropertyNames(args.options).length === 0) {
    console.log('No command line options supplied.')
    process.exit(1)
  } else if (Object.getOwnPropertyNames(args.options).length === 1 && args.options.api_key !== null) {
    apiKey = args.options.api_key
    fetchLatestYouWealthPrices()
  } else if ((Object.getOwnPropertyNames(args.options).length !== 4) ||
    (args.options.client_id === null) ||
    (args.options.client_secret === null) ||
    (args.options.api_key === null) ||
    (args.options.account_id === null)) {
    console.log('Please provide all command line options, or --api_key only for latest prices.')
    argv.help()
    process.exit(1)
  } else {
    clientId = args.options.client_id
    clientSecret = args.options.client_secret
    apiKey = args.options.api_key
    accountId = args.options.account_id
    retrieveYouWealthTransactions()
  }
}

/**
 * Retrieve YouWealth account transactions from BNZ,
 * then get unit prices for unique transaction dates,
 * finally invoking processTransactionsIntoSharesight.
 */
function retrieveYouWealthTransactions () {
  console.log('Retrieving transactions for YouWealth account ID', accountId)
  const transactions = TransactionFetcher.getTransactions(accountId)
  postedTransactions = TransactionParser.getPostedTransactions(transactions)
  console.log('Posted transaction count', postedTransactions.length)
  if (postedTransactions.length > 0) {
    // for each transaction, get unit prices for its transaction date
    let postedDates = []
    postedTransactions.forEach(element => {
      let thisPostedTransactionDate = TransactionParser.getTransactionDate(element)
      if (postedDates.indexOf(thisPostedTransactionDate) < 0) {
        postedDates.push(thisPostedTransactionDate)
      }
    })
    console.log('Unit prices unique dates', postedDates.length)
    UnitPriceFetcher.getUnitPricesForDates(apiKey, postedDates, processTransactionsIntoSharesight)
  }
}

/**
 * Creates trades in Sharesight for each of the YouWealth transactions.
 * @param {Object} unitPrices contains unit prices for date under key YYYY-MM-DD
 */
function processTransactionsIntoSharesight (unitPrices) {
  if (unitPrices && Object.keys(unitPrices).length > 0) {
    // create a trade for each transaction
    postedTransactions.forEach(element => {
      trades.push({
        'unique_identifier': TransactionParser.getTransactionId(element),
        'transaction_type': TransactionParser.getSharesightTransactionType(element),
        'transaction_date': TransactionParser.getTransactionDate(element),
        'symbol': TransactionParser.getFundCodeFor(TransactionParser.getTransactionFund(element)),
        'market': 'OTHER',
        // 'quantity': TransactionParser.getUnits(element),
        // 'price': TransactionParser.getUnitPrice(element, unitPrices),
        'brokerage': 0.0,
        'comments': 'Generated by YouWealthSight'
      })
    })
    getSharesightAccessToken(createTradesInSharesight)
  } else {
    console.error('Cannot process transactions, no unit prices available')
    process.exit(1)
  }
}

/**
 * Authenticates with Sharesight to obtain an access token.
 * @param {Function} callback to invoke with parameter of new Sharesight access token
 */
function getSharesightAccessToken (callback) {
  try {
    const credentials = {
      client: {
        id: clientId,
        secret: clientSecret
      },
      auth: {
        tokenHost: 'https://api.sharesight.com',
        tokenPath: '/oauth2/token'
      }
    }
    const oauth2 = require('simple-oauth2').create(credentials)
    oauth2.clientCredentials.getToken().then(function (value) {
      const accessToken = oauth2.accessToken.create(value)
      console.log('Connected to Sharesight', accessToken.token)
      callback(accessToken)
    }, function (reason) {
      console.log('Error getting access token from Sharesight', reason)
    })
  } catch (error) {
    console.error('Error connecting to Sharesight', error.message)
  }
}

/**
 * Creates trades in Sharesight for each posted transaction.
 * @param accessToken from connected Sharesight account
 */
function createTradesInSharesight (accessToken) {
  Sharesight.getPortfolioForName('Jo & Adrian', accessToken, addTradesToPortfolio)
}

function addTradesToPortfolio (portfolio) {
  console.log('Adding trades to portfolio', portfolio.id)
  trades.forEach(element => {
    console.log(element.transaction_date, element.symbol)
  })
}

/**
 * Retrieves YouWealth unit prices for today and prints them to console.
 */
function fetchLatestYouWealthPrices () {
  UnitPriceParser.getPricesForDate(apiKey, Date.now(), function (prices) {
    Object.keys(prices).forEach(function (key, index) {
      let price = prices[key]
      console.log(key + ' ' + String(price.fundName).padEnd(24, ' ') + ' as at ' + price.date + ' : BUY ' + price.buyPrice.amount + ' : SELL ' + price.sellPrice.amount)
    })
  })
}

start()
