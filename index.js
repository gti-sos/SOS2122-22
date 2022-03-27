const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const port = process.env.PORT || 8080;



const co2_stats_API = require("./src/jesvencamAPI/indexJESVENCAM.js");

const BASE_API_URL = "/api/v1";

app.use(bodyParser.json());

app.use("/",express.static('public'));

co2_stats_API.register(app);

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


//##################### API MARCOS SAA (marsaamar1) ####################//

var tradeStats = [
    {		
        country : "Spain",
        year : 2020,
        export : 500.817,
        import : 21003.13,
        balance : 423443.62
    },
    {
        country : "Italy",
        year : 2017,
        export : 2530.177,
        import : 24430.15,
        balance : 42234.77
    }
    
];

app.get(BASE_API_URL+"/trade-stats",(req,res)=>{
    res.send(JSON.stringify(tradeStats,null,2));
});

app.post(BASE_API_URL+"/trade-stats",(req,res)=>{
    tradeStats.push(req.body);
    res.sendStatus(201,"CREATED");
});

//######################   API Jesús Vena Campos  ###############################//


//##########################################



