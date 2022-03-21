const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
const BASE_API_URL = "/api/v1";

app.use(bodyParser.json());




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

app.get(BASE_API_URL+"/coalStats",(req,res)=>{
    res.send(JSON.stringify(coalStats,null,2));
});

app.post(BASE_API_URL+"/coalStats",(req,res)=>{
    coalStats.push(req.body);
    res.sendStatus(201,"CREATED");
});

//##################### API marsaamar1 ####################//
//Get Y Post 
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
        co2_tot : 2530.177,
        co2_kg : 24430.15,
        co2_tpc : 42234.77
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


var co2 = [
    {		
        country : "España",
        year : 2020,
        co2_tot : 214.817,
        co2_kg : 0.13,
        co2_tpc : 4.62
    },
    {
        country : "Alemania",
        year : 2017,
        co2_tot : 250.177,
        co2_kg : 0.15,
        co2_tpc : 4.77
    }
];

app.get(BASE_API_URL+"/co2-stats",(req,res)=>{
    res.send(JSON.stringify(co2,null,2));

});

app.get(BASE_API_URL+"/co2-stats",(req,res)=>{
    res.redirect(API_DOC_PORTAL);

});


app.post(BASE_API_URL+"/co2-stats",(req,res)=>{
    co2.push(req.body);
    res.sendStatus(201,"CREATED");

});
//ESTO BORRA TODOS LOS RECURSO  
app.delete(BASE_API_URL+"/co2-stats", (req, res)=>{
    co2 = [];
    res.sendStatus(200,"OK");
});


app.delete(BASE_API_URL+"/co2-stats/:country", (req, res)=>{
    var countryName = req.params.country;
    co2.filter((c)=>{
        return(c.country!=countryName);
    })
    res.sendStatus(200,"OK");
});


app.get(BASE_API_URL+"/co2-stats/:country", (req, res)=>{
    var countryName = req.params.country;
    filteredCountries = co2.filter((c)=>{
        return(c.country == countryName);
    })
    if(filteredCountries == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredCountries[0],null,2));
    }

    res.sendStatus(200,"OK");


});

//##########################################

app.use("/",express.static('public'));

//----------------------------------------------------

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});
//----------------------------------------------------

