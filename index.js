const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;


const coal_stats_API = require("./src/back/belrodsalAPI/v1/indexBelrodsal.js");
const coal_stats_APIV2 = require("./src/back/belrodsalAPI/v2/indexBelrodsalV2.js");
const co2_stats_API = require("./src/back/jesvencamAPI/indexJESVENCAM.js");
const trade_stats_API = require("./src/back/marsaamar1API/v1/index_marsaamar1.js");

const Datastore = require('nedb');

db_co2_stats = new Datastore();
db_coal_stats = new Datastore();
db_trade_stats = new Datastore();

co2_stats_API.register(app,db_co2_stats);
coal_stats_API.register(app,db_coal_stats);
<<<<<<< HEAD
coal_stats_APIV2(app,db_coal_stats);
trade_stats_API.register(app,db_trade_stats);

=======
coal_stats_APIV2.register(app,db_coal_stats);
>>>>>>> 20abb2ef8b38c1bbc9df36c3aa2b30495fd2ee9d

const BASE_API_URL = "/api/v1";



app.use("/",express.static('./public'));


//trade_stats_API(app);

//----------------------------------------------------

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});
//----------------------------------------------------








