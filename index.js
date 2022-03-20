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




/*
/********   API Jesús Vena Campos  *********/


//const express = require("express");
//const bodyParser = require("body-parser");
//const app = express();
//const port = process.env.PORT || 8081;

/*app.use(bodyParser.json());

//const BASE_API_URL = "/api/v1";

var contacts = [
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
    res.send(JSON.stringify(contacts,null,2));

});

app.get(BASE_API_URL+"/co2-stats",(req,res)=>{
    res.redirect(API_DOC_PORTAL);

});


app.post(BASE_API_URL+"/co2-stats",(req,res)=>{
    contacts.push(req.body);
    res.sendStatus(201,"CREATED");

});
//ESTO BORRA TODOS LOS RECURSO  
app.delete(BASE_API_URL+"/co2-stats", (req, res)=>{
    contacts = [];
    res.sendStatus(200,"OK");
});


app.delete(BASE_API_URL+"/co2-stats/:country", (req, res)=>{
    var contactName = req.params.name;
    contacts.filter((contact)=>{
        return(contact.name!=contactName);
    })
    res.sendStatus(200,"OK");
});


app.get(BASE_API_URL+"/co2-stats/:country", (req, res)=>{
    var contactName = req.params.name;
    filteredContacts = contacts.filter((contact)=>{
        return(contact.name == contactName);
    })
    if(filteredContacts == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredContacts[0],null,2));
    }

    res.sendStatus(200,"OK");


});



//app.use("/",express.static('public'));

//para que esté escuchando en un puerto 
app.listen(port,() =>{
console.log(`Server ready at port ${port}`)
});

*/