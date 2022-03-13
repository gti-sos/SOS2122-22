const cool = require("cool-ascii-faces");

const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

app.get("/cool",(req,res)=>{
    console.log("Requested / route");
    res.send("<html><body>"+cool()+"</body></html>")
});

app.use("/", express.static('public'));



app.listen(port, () =>{
    console.log(`server TRULY ready at the port ${port}`);
});
