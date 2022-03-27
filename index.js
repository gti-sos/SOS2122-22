const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const port = process.env.PORT || 8080;



const coal_stats_API = require("./src/belrodsalAPI/indexBelrodsal.js");

const BASE_API_URL = "/api/v1";

app.use(bodyParser.json());

app.use("/",express.static('public'));

coal_stats_API(app);

//----------------------------------------------------

app.listen(port, () =>{
    console.log(`Server ready at port ${port}`);
});