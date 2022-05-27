const bodyParser = require("body-parser");
const axios = require('axios').default;

module.exports.register = (app) =>{

    const axios = require("axios");

    const options = {
        method: 'GET',
        url: 'https://live-crypto-prices.p.rapidapi.com/pricefeed',
        headers: {
          'X-RapidAPI-Host': 'live-crypto-prices.p.rapidapi.com',
          'X-RapidAPI-Key': '2bdc8db655mshe41826473898117p1e0a5ejsn1e94c4a7b3b4'
        }
      };
    
    axios.request(options).then(function (response) {
        criptos = response.data.result;
    }).catch(function (error) {
        console.error(error);
    });

    app.get("/api/v2/apiCriptos", (req, res) => {
        res.send(JSON.stringify(criptos));
    });
}