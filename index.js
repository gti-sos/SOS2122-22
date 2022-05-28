require("dotenv");
const express = require("express");
const bodyParser = require("body-parser")
const app = express();

const port = process.env.PORT || 8080;
const request = require('request');
const cors = require('cors'); //opciones de cors por defecto para simplificar. 
const generate = require('node-chartist');

app.use(bodyParser.json());

app.use(cors());    //Debe de estar antes de registrar alguna ruta. 


//Belen ------------------------------------------------------------------------
const coal_stats_API = require("./src/back/belrodsalAPI/v1/indexBelrodsal.js");
const coal_stats_APIV2 = require("./src/back/belrodsalAPI/v2/indexBelrodsalV2.js");
const contamination_API = require("./src/back/belrodsalAPI/v2/indexApi1.js");
const planets_API = require("./src/back/belrodsalAPI/v2/planetApi.js");
const Lol_API = require("./src/back/belrodsalAPI/v2/LolApi.js");
const valorant_API = require("./src/back/belrodsalAPI/v2/apiValorant.js");
const tiempo_API = require("./src/back/belrodsalAPI/v2/apiTiempo.js");
//------------------------------------------------------------------------------

//const co2_stats_API = require("./src/back/jesvencamAPI/v1/indexJesvencam.js");
const co2_stats_APIV2 = require("./src/back/jesvencamAPI/v2/indexJesvencam.js");


//Marcos ------------------------------------------------------------------------
const trade_stats_API = require("./src/back/marsaamar1API/v1/index_marsaamar1.js");
const trade_stats_APIV2 = require("./src/back/marsaamar1API/v2/index_marsaamar1_v2.js");
const Covid_API = require("./src/back/marsaamar1API/v2/ApiCOVID.js");
const Criptos_API = require("./src/back/marsaamar1API/v2/ApiCripto.js");
const Anime_API = require("./src/back/marsaamar1API/v2/ApiAnime.js");

const Datastore = require('nedb');


db_co2_stats = new Datastore();
db_coal_stats = new Datastore();
db_trade_stats_v1 = new Datastore();
db_trade_stats = new Datastore();

//co2_stats_API.register(app,db_co2_stats);
co2_stats_APIV2.register(app,db_co2_stats);

//Belen ------------------------------------------
contamination_API.register(app);
planets_API.register(app);
Lol_API.register(app);
valorant_API.register(app);
coal_stats_API.register(app,db_coal_stats);
coal_stats_APIV2.register(app,db_coal_stats);
tiempo_API.register(app);
//------------------------------------------------

trade_stats_API.register(app,db_trade_stats_v1);
trade_stats_APIV2.register(app,db_trade_stats);
Covid_API.register(app);
Criptos_API.register(app);
Anime_API.register(app);



const BASE_API_URL = "/api/v1";

//PROXY marsaamar1

var pathsLoadRaul='/remoteApiLoadRaul';
var apiServerHostRaul = 'https://sos2122-24.herokuapp.com/api/v2/cancerdeaths-stats/loadInitialData';

app.use(pathsLoadRaul, function(req, res) {
  var url = apiServerHostRaul + req.url;
  console.log('piped: ' + req.url);
  req.pipe(request(url)).pipe(res);
});

var pathsRaul='/remoteApiRaul';
var apiServerHostRaul2 = 'https://sos2122-24.herokuapp.com/api/v2/cancerdeaths-stats';

app.use(pathsRaul, function(req, res) {
  var url = apiServerHostRaul2 + req.url;
  console.log('piped: ' + req.url);
  req.pipe(request(url)).pipe(res);
});



//Proxy Jesús Vena: 

var paths2='/remoteApiEnergy';
var apiServerHost2 = 'https://sos2122-10.herokuapp.com/api/v2/energy-consumptions';

app.use(paths2, function(req, res) {
  var url = apiServerHost2 + req.url;
  req.pipe(request(url)).pipe(res);	
});



app.use("/",express.static('./public'));


app.use("/jesvencam",express.static('./public/jesvencam'));

//Proxy Belén Rodriguez: 

var paths3='/remoteApiTennis';
var paths4='/remoteApiTennisLoadInitialData';
var apiServerHost3 = 'https://sos2122-23.herokuapp.com/api/v2/tennis';
var apiServerHost4 = 'https://sos2122-23.herokuapp.com/api/v2/tennis/loadInitialData';

app.use(paths3, function(req, res) {
  var url1 = apiServerHost3 + req.url;
  req.pipe(request(url1)).pipe(res);	
});
app.use(paths4, function(req, res) {
  var url2 = apiServerHost4 + req.url;
  req.pipe(request(url2)).pipe(res);	
});



app.use("/",express.static('./public'));


app.use("/jesvencam",express.static('./public/jesvencam'));


//----------------------------------------------------

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});
//----------------------------------------------------








