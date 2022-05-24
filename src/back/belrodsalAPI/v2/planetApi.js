const bodyParser = require("body-parser");
const axios = require('axios').default;

module.exports.register = (app) =>{

    const axios = require("axios");

    const options = {
        method: 'GET',
        url: 'https://brightest-stars.p.rapidapi.com/brightstars',
        headers: {
            'X-RapidAPI-Host': 'brightest-stars.p.rapidapi.com',
            'X-RapidAPI-Key': '6a66802649msh0cd821c29111ed4p11ba77jsn91b933e119db'
        }
    };

    axios.request(options).then(function (response) {
        star = response.data;
        console.log("------------------------");
        console.log(star);
        }).catch(function (error) {
            console.error(error);
        }); 

    app.get("/api/v2/apiIntegradaPlaneta", (req, res) => {
        res.send(JSON.stringify(star));
    });
}
   