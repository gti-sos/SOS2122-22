const bodyParser = require("body-parser");
const axios = require('axios').default;

module.exports.register = (app) =>{

    const options = {
      method: 'GET',
      url: 'https://air-quality.p.rapidapi.com/forecast/airquality',
      params: {lat: '37.3826', lon: '-5.99629', hours: '72'},
      headers: {
        'X-RapidAPI-Host': 'air-quality.p.rapidapi.com',
        'X-RapidAPI-Key': '6a66802649msh0cd821c29111ed4p11ba77jsn91b933e119db'
      }
    };

    axios.request(options).then(function (response) {
        air=response.data.data;
        
    }).catch(function (error) {
        console.error(error);
    });   

    app.get("/api/v2/apiIntegrada", (req, res) => {
        res.send(JSON.stringify(air));
    });
}
    
