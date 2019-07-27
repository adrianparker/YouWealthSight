# YouWealthSight
Maintain BNZ YouWealth managed fund transactions in a Sharesight portfolio.

## Project status
Work in progress. As at July 2019 all this program does is retrieve the latest YouWealth fund prices.

## BNZ API Key
You will need your own BNZ Fund Unit Prices API Key to use this application. As at July 2019, I use the API Key that BNZ make available in the public source of their website. (Visit https://www.bnz.co.nz and view source)

## Usage
Ensure you have node installed. (v10.16.0 is the version app is developed against, but anything modern should be fine).
Clone the repo to a local directory.
There are two usages for the application. 

The first is a simple 'what are the latest prices' check.  For this you just need to supply the BNZ API key to use.
For example:

```
cd YouWealthSight
npm install
./YouWealthSight.js -k APIKEY
```
The second (work in progress, not yet functional) will create trades that match your BNZ YouWealth account transactions in Sharesight.  For this you will need to supply the BNZ API key to use, as well as your BNZ YouWealth account and Sharesight account details.
For example:

```
cd YouWealthSight
npm install
./YouWealthSight.js -k APIKEY -a ACCOUNT_ID -c CLIENT_ID
```

## Tests

To execute tests you will need to pass the BNZ API key to use, via parameter --api_key.
For example:

```
npm test -- --api_key=APIKEY
```

Or you can pass --api_key=APIKEY to Mocha as an argument.

## Contributing
Fire in a pull request by all means. Please adhere to Javascript Standard Style: https://standardjs.com/rules.html

### Disclosure & Disclaimer
This project is not endorsed nor supported in any way by Bank of New Zealand. You should not rely on the fitness nor accuracy of anything related to this project, for any purpose. Caveat emptor and all that.