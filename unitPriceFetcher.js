var UnitPriceParser = require('./unitPriceParser')
exports.getUnitPricesForDates = function (apiKey, dates, callback) {
  var promises = []
  var results = {}
  dates.forEach(element => {
    // TODO need to store the payload resolved etc
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
