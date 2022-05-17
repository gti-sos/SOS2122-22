const bodyParser = require("body-parser");
const axios = require('axios').default;

module.exports.register = (app) =>{

    

    const options = {
      method: 'GET',
      url: 'https://air-quality.p.rapidapi.com/forecast/airquality',
      params: {lat: '35.779', lon: '-78.638', hours: '72'},
      headers: {
        'X-RapidAPI-Host': '',
        'X-RapidAPI-Key': ''
      }
    };

    axios.request(options).then(function (response) {
        air=response.data.data;
        console.log(air);
    }).catch(function (error) {
        console.error(error);
    });   

    app.get("/api/v2/apiIntegrada", (req, res) => {
        res.send(JSON.stringify(air));
    });
}
    
