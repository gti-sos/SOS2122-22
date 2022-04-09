const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;


const coal_stats_API = require("./src/back/belrodsalAPI/indexBelrodsal.js");
const co2_stats_API = require("./src/back/jesvencamAPI/indexJESVENCAM.js");
const trade_stats_API = require("./src/back/marsaamar1API/index_marsaamar1.js");

const Datastore = require('nedb');

db_co2_stats = new Datastore();
db_coal_stats = new Datastore();

co2_stats_API.register(app,db_co2_stats);
coal_stats_API(app,db_coal_stats);

const BASE_API_URL = "/api/v1";


app.use("/",express.static('./public'));


trade_stats_API(app);

//----------------------------------------------------

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});
//----------------------------------------------------








