const bodyParser = require("body-parser");
const axios = require('axios').default;
var p;

module.exports.register = (app) =>{

    const options = {
        method: 'GET',
        url: 'https://country-facts.p.rapidapi.com/region/europe',
        headers: {
          'X-RapidAPI-Host': 'country-facts.p.rapidapi.com',
          'X-RapidAPI-Key': '2bdc8db655mshe41826473898117p1e0a5ejsn1e94c4a7b3b4'
        }
      };
    
    axios.request(options).then(function (response) {
        p = response.data;
    }).catch(function (error) {
        console.error(error);
    });

    app.get("/api/v2/apiArea", (req, res) => {
        res.send(JSON.stringify(p));
    });
}