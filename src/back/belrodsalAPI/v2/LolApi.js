const bodyParser = require("body-parser");
const axios = require('axios').default;

let lol;

module.exports.register = (app) =>{

    const axios = require("axios");

    const options = {
        method: 'GET',
        url: 'https://lol_stats.p.rapidapi.com/euw1/MagiFelix5',
        headers: {
          'X-RapidAPI-Host': 'lol_stats.p.rapidapi.com',
          'X-RapidAPI-Key': '6a66802649msh0cd821c29111ed4p11ba77jsn91b933e119db'
        }
      };
      
      axios.request(options).then(function (response) {
          
          lol = response.data.mostPlayedChamps;
        }).catch(function (error) {
          console.error(error);
        });

    app.get("/api/v2/apiLol", (req, res) => {
        res.send(JSON.stringify(lol));
    });
}
   