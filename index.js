const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const port = process.env.PORT || 8080;


const coal_stats_API = require("./src/belrodsalAPI/indexBelrodsal.js");
const co2_stats_API = require("./src/jesvencamAPI/indexJESVENCAM.js");
const trade_stats_API = require("./src/marsaamar1API/index_marsaamar1.js");

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















//#####################   Belén Rodríguez (belrodsal) ####################//
//Get Y Post con datos Belén Rodríguez (belrodsal)
var coalStats = [
    {
        country:"Spain",
        milesTon:123456
    },
    {
        country:"Australia",
        milesTon:56789
    }
];

app.get(BASE_API_URL+"/coal-stats",(req,res)=>{
    res.send(JSON.stringify(coalStats,null,2));
});

app.post(BASE_API_URL+"/coal-stats",(req,res)=>{
    coalStats.push(req.body);
    res.sendStatus(201,"CREATED");
});

//######################   API Jesús Vena Campos  ###############################//


//##########################################



