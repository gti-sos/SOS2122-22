
const bodyParser = require("body-parser");
const BASE_API_URL = "/api/v1";

var coalStats = [
{
    country:"spain",
    year:2005,
    productions:123456,
    exports:63.70,
    consumption:49070.43
},
{
    country:"australia",
    year:2005,
    productions:21474.10,
    exports:1754.70,
    consumption:0
}
];


module.exports = (app) =>{

    //##########################################
    //GET
    
        app.get(BASE_API_URL+"/coal-stats/loadInitialData",(req,res)=>{
            if(coalStats.length==0){
                coalStats.push({		
                    country : "spain",
                    year:2005,
                    productions:123456,
                    exports:63.70,
                    consumption:49070.43
                },
                {
                    country:"australia",
                    year:2005,
                    productions:21474.10,
                    exports:1754.70,
                    consumption:0
                },{		
                    country : "china",
                    year : 2005,
                    productions : 2607124.00,
                    exports : 79068.70,
                    consumption : 0
                },
                {
                    country : "eeuu",
                    year : 2005,
                    productions : 1131498.13,
                    exports : 49942.21,
                    consumption : 0
                },{		
                    country : "india",
                    year : 2005,
                    productions : 473265.78,
                    exports : 1754.75,
                    consumption : 0
                })
        
            }
            res.send(JSON.stringify(coalStats,null,2));
        
        });
        
        app.get(BASE_API_URL+"/coal-stats",(req,res)=>{
            res.send(JSON.stringify(coalStats,null,2));
        });
        
        app.get(BASE_API_URL+"/coal-stats/docs",(req,res)=>{
            res.redirect("https://documenter.getpostman.com/view/19481676/UVyn2ykY");
        
        });
        
        
        
        //GET
        app.get(BASE_API_URL+"/coal-stats/:country", (req, res)=>{
            var countryName = req.params.country;
            filteredCountries = coalStats.filter((c)=>{
                return(c.country == countryName);
            })
            if(filteredCountries == 0){
                res.sendStatus(404,"NOT FOUND");
            }else{
                res.send(JSON.stringify(filteredCountries[0],null,2));
            }
        
            res.sendStatus(200,"OK");
        
        
        });

        

        app.get(BASE_API_URL+"/coal-stats/:country/:year", (req, res)=>{
            var countryName = req.params.country;
            var countryYear = req.params.year;
            filteredCountries = coalStats.filter((c) => {
            return ((c.country == countryName) && (c.year == countryYear));
            })
            if (filteredIuv == 0) {
                res.sendStatus(404, "NOT FOUND");
            }
            else {
                res.send(JSON.stringify(filteredIuv[0], null, 2));
            }
        });
        
        
        
        
        //##########################################
        
        //POST
        
        
        app.post(BASE_API_URL+"/coal-stats", (req,res) => {
            if(test_Peticion(req)){
                res.sendStatus(400,"BAD REQUEST")
            }
            else{
                filteredIuv = coalStats.filter( (e) => {
                    return (e.country == req.body.country
                        &&  e.year == req.body.year
                        &&  e.veh_use_comm == req.body.veh_use_comm
                        &&  e.veh_use_pass == req.body.veh_use_pass
                        &&  e.veh_use_per_1000 == req.body.veh_use_per_1000);
                }); 
        
                recursoExistente = coalStats.filter( (e) => {
                    return (e.year == req.body.year && e.country == req.body.country);
                })
                if(recursoExistente != 0){
                    res.sendStatus(409,"CONFLICT");
                }else{
                    coalStats.push(req.body);
                    res.sendStatus(201,"CREATED");
                }
            }
        });
        
        
        // POST A UN RECURSO CONCRETO (INCORRECTO)
        app.post(BASE_API_URL+"/in-use-vehicles/:country/:year",(req, res)=>{
            res.sendStatus(405,"METHOD NOT ALLOWED");
        });
        
        //##########################################
        
        //PUT
        
        
        app.put(BASE_API_URL+"/coal-stats",(req,res)=>{
            res.sendStatus(405,"Method Not Allowed");
        
        })
        
        app.put(BASE_API_URL+"/coal-stats/:country/:year",(req,res)=>{
            if(test_Peticion(req)){
                res.sendStatus(400,"Bad Request");
    
            }else{
                var countryName = req.params.country;
                var yearReq = req.params.year;
                var body = req.body;
                var pointer = coalStats.findIndex((reg)=>{
                    return (reg.country == countryName && reg.year == yearReq)
                })
                if(pointer == null){
                    res.sendStatus(404,"Not Found");
                }else if(countryName !=body.country || yearReq !=body.year){
                    res.sendStatus(400,"Bad Request");
                
                
                }else if(countryName == body.country && yearReq !=body.year){
                    res.sendStatus(404,"Not Found");
                }else{
                    var new_stat = {...body};
                    coalStats[pointer] = new_stat;
                    res.sendStatus(200,"OK");
                }
            }
            
        })
        
        
        //##########################################
        //DELETE
        
        
        app.delete(BASE_API_URL+"/coal-stats/:country", (req, res)=>{
            var countryName = req.params.country;
            filteredCountries = coalStats.filter((c)=>{
                return(c.country == countryName);
            });
            if(filteredCountries == 0){
                res.sendStatus(404,"NOT FOUND");
            }else{
                coalStats.filter((c)=>{
                    return(c.country!=countryName);
                    coalStats.pop()
                })
                res.sendStatus(200,"OK");
            }    
        });
        
        app.delete(BASE_API_URL+"/coal-stats/:country/:year", (req,res) => {
            var countryName = req.params.country;
            var countryName = req.params.year;
            filteredIuv = coalStats.filter( (e) => {
                return ((e.country == countryName) && (e.year == countryName));
            });
            if(filteredIuv == 0){
                res.sendStatus(404,"NOT FOUND");
            }
            else{
                var i = coalStats.indexOf(filteredIuv[0]);
                if(i!==-1){
                    coalStats.splice(i,1);
                }
            }
            res.sendStatus(200, "OK");
        })
         
        app.delete(BASE_API_URL+"/coal-stats", (req, res)=>{
            coalStats = [];
            res.sendStatus(200,"OK");
        });
    
        function test_Peticion(req){
            return (req.body.country == null |
                    req.body.year == null |
                    req.body.productions == null |
                    req.body.exports == null |
                    req.body.consumption == null );
        }

};