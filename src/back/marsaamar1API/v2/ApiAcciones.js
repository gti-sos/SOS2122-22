const bodyParser = require("body-parser");
const axios = require('axios').default;
var acciones;

module.exports.register = (app) =>{

    const axios = require("axios");
    const options = {
        method: 'GET',
        url: 'https://latest-stock-price.p.rapidapi.com/price',
        params: {Indices: 'NIFTY 50'},
        headers: {
          'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com',
          'X-RapidAPI-Key': '2bdc8db655mshe41826473898117p1e0a5ejsn1e94c4a7b3b4'
        }
      };
    
    axios.request(options).then(function (response) {
        acciones = response.data;
    }).catch(function (error) {
        console.error(error);
    });

    app.get("/api/v2/apiAcciones", (req, res) => {
        res.send(JSON.stringify(acciones));
    });
}