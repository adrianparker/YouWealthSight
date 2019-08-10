const UnitPriceParser = require('./unitPriceParser')

/**
 * Provides an object with properties named for each of given dates, with unit prices for that date as values.
 * @param apiKey key to use calling BNZ's Fund Unit Prices API
 * @param dates array of dates (yyyy-mm-dd or milliseconds) unit prices are wanted for
 * @param callback function to invoke when prices have been obtained for all dates
 */
exports.getUnitPricesForDates = function (apiKey, dates, callback) {
  const promises = []
  let results = {}
  dates.forEach(element => {
    promises.push(new Promise(function (resolve, reject) {
      UnitPriceParser.getPricesForDate(apiKey, element, function (result) {
        results[element] = result
        resolve()
      }, reject)
    }))
  })
  Promise.all(promises).then(function () {
    callback(results)
  }, function () {
    callback(null)
  })
}
