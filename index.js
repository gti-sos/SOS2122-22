const cool = require("cool-ascii-faces");
const bodyParser = require("body-parser");

const express = require("express");

const app = express();
const port = process.env.PORT || 8080;
/*
app.get("/cool",(req,res)=>{
    console.log("Requested / route");
    res.send("<html><body>"+cool()+"</body></html>")
});

app.use("/", express.static('public'));
*/

app.use(bodyParser.json());

const BASE_API_URL = "/api/v1";

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

app.get(BASE_API_URL+"/coalStats",(req,res)=>{
    res.send(JSON.stringify(coalStats,null,2));
});

app.post(BASE_API_URL+"/coalStats",(req,res)=>{
    coalStats.push(req.body);
    res.sendStatus(201,"CREATED");
});
//----------------------------------------------------

app.listen(port, () =>{
    console.log(`server TRULY ready at the port ${port}`);
});
