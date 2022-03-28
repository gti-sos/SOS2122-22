
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
        
        //##########################################
        
        //POST
        
        
        app.post(BASE_API_URL+"/coal-stats",(req,res)=>{
            coalStats.push(req.body);
            res.sendStatus(201,"CREATED");
        
        });
        
        app.post(BASE_API_URL+"/coal-stats/:country",(req,res)=>{
            var countryName = req.params.country;
            filteredCountries = coalStats.filter((c)=>{
                return(c.country == countryName);
            });
            if(filteredCountries != 0){
                res.sendStatus(409,"Conflict");
            }else{
                res.sendStatus(405,"Method Not Allowed");
            }
          
        
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
                    res.sendStatus(200,"Updated");
                }
            }
            
        })
        
        
        //##########################################
        //DELETE
        
        
        app.delete(BASE_API_URL+"/coal-stats/:country", (req, res)=>{
            var countryName = req.params.country;
            coalStats = coalStats.filter((c)=>{
                return(c.country!=countryName);
            })
            res.sendStatus(200,"OK");
        });
        
         
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