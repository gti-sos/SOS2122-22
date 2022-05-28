const bodyParser = require("body-parser");
const axios = require('axios').default;

let v;

module.exports.register = (app) =>{

  const options = {
    method: 'GET',
    url: 'https://valorant-agents-maps-arsenal.p.rapidapi.com/agents/es-es',
    headers: {
      'X-RapidAPI-Host': 'valorant-agents-maps-arsenal.p.rapidapi.com',
      'X-RapidAPI-Key': '6a66802649msh0cd821c29111ed4p11ba77jsn91b933e119db'
    }
  };
  
  axios.request(options).then(function (response) {
    v = response.data.agents;
  }).catch(function (error) {
    console.error(error);
  });   

    app.get("/api/v2/apiValorant", (req, res) => {
        res.send(JSON.stringify(v));
    });
}