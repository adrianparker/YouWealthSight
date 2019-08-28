const RestClient = require('node-rest-client').Client
const client = new RestClient()
var token

/**
 * Retrieves list of portfolios for given Sharesight account.
 * @param {AccessToken} accessToken for Sharesight account access
 */
exports.getPortfolios = function (accessToken) {
  token = accessToken
  callEndpoint('https://api.sharesight.com/api/v2/portfolios.json', writeDataToConsole)
}

/**
 * Retrieves portfolio with given name for given Sharesight account.
 * @param {String} portfolioName case sensitive to filter account's portfolios by
 * @param {AccessToken} accessToken for Sharesight account access
 * @param callback to call with matching portfolio or null if no match
 */
exports.getPortfolioForName = function (portfolioName, accessToken, callback) {
  token = accessToken
  new Promise(function (resolve, reject) {
    callEndpoint('https://api.sharesight.com/api/v2/portfolios.json', resolve)
  }).then(function (data) {
    const portfolios = data.portfolios
    portfolios.forEach(element => {
      if (element.name === portfolioName) {
        callback(element)
      }
    })
  })
}

function callEndpoint (url, callback) {
  client.get(url, {
    headers: { 'Authorization': 'Bearer ' + token.token.access_token }
  }, callback)
}

function writeDataToConsole (data, response) {
  console.log(JSON.stringify(data))
}
