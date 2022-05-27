const bodyParser = require("body-parser");
const axios = require('axios').default;

let r;

module.exports.register = (app) =>{

    const axios = require("axios");

    const options = {
      method: 'GET',
      url: 'https://movies-app1.p.rapidapi.com/api/movies',
      headers: {
        'X-RapidAPI-Host': 'movies-app1.p.rapidapi.com',
        'X-RapidAPI-Key': '6a66802649msh0cd821c29111ed4p11ba77jsn91b933e119db'
      }
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
       r = response.data
    }).catch(function (error) {
      console.error(error);
    });

    app.get("/api/v2/apiTiempo", (req, res) => {
        res.send(JSON.stringify(r));
    });
}
   