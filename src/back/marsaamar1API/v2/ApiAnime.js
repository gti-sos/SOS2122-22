const bodyParser = require("body-parser");
const axios = require('axios').default;

module.exports.register = (app) =>{

    const axios = require("axios");

    const options = {
        method: 'GET',
        url: 'https://top-anime.p.rapidapi.com/all',
        headers: {
          'X-RapidAPI-Host': 'top-anime.p.rapidapi.com',
          'X-RapidAPI-Key': '2bdc8db655mshe41826473898117p1e0a5ejsn1e94c4a7b3b4'
        }
      };
    
    axios.request(options).then(function (response) {
        animes = response.data;
    }).catch(function (error) {
        console.error(error);
    });

    app.get("/api/v2/apiAnime", (req, res) => {
        res.send(JSON.stringify(animes));
    });
}