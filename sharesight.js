const RestClient = require('node-rest-client').Client
const client = new RestClient()

/**
 * Retrieves list of portfolios for given Sharesight account.
 * @param {AccessToken} accessToken for Sharesight account access
 */
exports.getPortfolios = function (accessToken) {
  callEndpoint('https://api.sharesight.com/api/v2/portfolios.json', accessToken, writeDataToConsole)
}

exports.getPortfolioForName = function (portfolioName) {
  // TODO
}

function callEndpoint (url, accessToken, callback) {
  client.get(url, {
    headers: { 'Authorization': 'Bearer ' + accessToken.token.access_token }
  }, callback)
}

function writeDataToConsole (data, response) {
  console.log(JSON.stringify(data))
}
