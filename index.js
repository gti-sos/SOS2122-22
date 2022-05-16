const express = require("express");
const bodyParser = require("body-parser")
const app = express();
const port = process.env.PORT || 8082;
const request = require('request');
const cors = require('cors'); //opciones de cors por defecto para simplificar. 
const co = require('co');
const generate = require('node-chartist');



app.use(bodyParser.json());

app.use(cors());    //Debe de estar antes de registrar alguna ruta. 

const coal_stats_API = require("./src/back/belrodsalAPI/v1/indexBelrodsal.js");
const coal_stats_APIV2 = require("./src/back/belrodsalAPI/v2/indexBelrodsalV2.js");
//const co2_stats_API = require("./src/back/jesvencamAPI/v1/indexJesvencam.js");
const co2_stats_APIV2 = require("./src/back/jesvencamAPI/v2/indexJesvencam.js");
const trade_stats_API = require("./src/back/marsaamar1API/v1/index_marsaamar1.js");
const trade_stats_APIV2 = require("./src/back/marsaamar1API/v2/index_marsaamar1_v2.js");

const Datastore = require('nedb');

db_co2_stats = new Datastore();
db_coal_stats = new Datastore();
db_trade_stats_v1 = new Datastore();
db_trade_stats = new Datastore();

//co2_stats_API.register(app,db_co2_stats);
co2_stats_APIV2.register(app,db_co2_stats);

coal_stats_API.register(app,db_coal_stats);
coal_stats_APIV2.register(app,db_coal_stats);
trade_stats_API.register(app,db_trade_stats_v1);
trade_stats_APIV2.register(app,db_trade_stats);


const BASE_API_URL = "/api/v1";






//Proxy Jesús Vena: 

var paths2='/remoteApiEnergy';
var apiServerHost2 = 'https://sos2122-10.herokuapp.com/api/v2/energy-consumptions';

app.use(paths2, function(req, res) {
  var url = apiServerHost2 + req.url;
  req.pipe(request(url)).pipe(res);	
});



app.use("/",express.static('./public'));


app.use("/jesvencam",express.static('./public/jesvencam'));



//trade_stats_APIV2V2(app);

//----------------------------------------------------

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});
//----------------------------------------------------








