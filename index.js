const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const port = process.env.PORT || 8080;


const coal_stats_API = require("./src/back/belrodsalAPI/indexBelrodsal.js");
const co2_stats_API = require("./src/back/jesvencamAPI/indexJESVENCAM.js");
const trade_stats_API = require("./src/back/marsaamar1API/index_marsaamar1.js");

const BASE_API_URL = "/api/v1";

app.use(bodyParser.json());

app.use("/",express.static('public'));

coal_stats_API(app);
co2_stats_API.register(app);
trade_stats_API(app);

//----------------------------------------------------

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});
//----------------------------------------------------








