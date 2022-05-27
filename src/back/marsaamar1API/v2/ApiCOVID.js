const bodyParser = require("body-parser");
const axios = require('axios').default;

module.exports.register = (app) =>{

    const axios = require("axios");

    const options = {
        method: 'GET',
        url: 'https://covid-19-coronavirus-statistics2.p.rapidapi.com/continentData',
        headers: {
          'X-RapidAPI-Host': 'covid-19-coronavirus-statistics2.p.rapidapi.com',
          'X-RapidAPI-Key': '2bdc8db655mshe41826473898117p1e0a5ejsn1e94c4a7b3b4'
        }
      };
    
    axios.request(options).then(function (response) {
        datasDeath = response.data.result;
    }).catch(function (error) {
        console.error(error);
    });

    app.get("/api/v2/apiCovid", (req, res) => {
        res.send(JSON.stringify(datasDeath));
    });
}