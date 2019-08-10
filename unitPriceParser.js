const RestClient = require('node-rest-client').Client

/*
Inception: as at 2018-05-21
Fund BNZ2112007 : BUY 1.001300 : SELL 0.998900
Fund BNZ2112008 : BUY 1.001400 : SELL 0.998900
Fund BNZ2112009 : BUY 1.001300 : SELL 0.998900
Fund BNZ2112010 : BUY 1.001200 : SELL 0.999000
Fund BNZ2112011 : BUY 1.001100 : SELL 0.999000
*/

/**
 * Provides YouWealth fund unit prices relevant at given date.
 * @param apiKey api key for BNZ's fund unit price API
 * @param date number of milliseconds or yyyy-mm-dd of date to get prices for
 * @param callback function to return object to
 * @param err function to call if an error occurs
 * @return {object} containing YouWealth fund prices, keyed by the relevant YouWealth fund code
 */
exports.getPricesForDate = function (apiKey, date, callback, err) {
  let youwealthFunds = {}
  if (apiKey && apiKey.length > 0) {
    if (date && !isNaN(Date.parse(new Date(date)))) {
      const pricesAtDate = new Date(date).toISOString().split('T')[0]
      const client = new RestClient()
      const args = {
        path: { 'yyyy-mm-dd': pricesAtDate },
        headers: { 'ApiKey': apiKey }
      }
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-template-curly-in-string
      client.get('https://api.bnz.co.nz/v1/fundunitprices?date=${yyyy-mm-dd}&fundProduct=retailManagedFund', args, function (data, response) {
        const fundUnitPrices = JSON.parse(data)
        if (fundUnitPrices && fundUnitPrices.fundUnitPrices) {
          for (let i = 0; i < fundUnitPrices.fundUnitPrices.length; i++) {
            youwealthFunds[fundUnitPrices.fundUnitPrices[i].fundCode] = fundUnitPrices.fundUnitPrices[i]
          }
        }
        callback(youwealthFunds)
      })
    } else {
      err('Null or bad date')
    }
  } else {
    err('Null or blank apiKey')
  }
}
