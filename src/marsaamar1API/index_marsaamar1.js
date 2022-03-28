
const bodyParser = require("body-parser");
const BASE_API_URL = "/api/v1";
const API_DOC_TRADE = "https://documenter.getpostman.com/view/19585767/UVsTqhfQ";

var loadInitialDataTradeStats = [
    {		
        country : "España",
        year : 2018,
        export : 293458.8,
        import : 330635.8,
        balance : -37177.1
    },
    {		
        country : "Alemania",
        year : 2018,
        export : 1320732.4,
        import : 1087431.3,
        balance : 233301.1
    },
    {		
        country : "Reino Unido",
        year : 2018,
        export : 412055.5,
        import : 570546.8,
        balance : -158491.3
    },
    {		
        country : "Francia",
        year : 2018,
        export : 492964.1,
        import : 572576.0,
        balance : -79611.9
    },
    {		
        country : "Italia",
        year : 2018,
        export : 465325.4,
        import : 426045.7,
        balance : 39279.7
    }
    
];

var tradeStats = [
    {		
        country : "España",
        year : 2018,
        export : 293458.8,
        import : 330635.8,
        balance : -37177.1
    },
    {		
        country : "Alemania",
        year : 2018,
        export : 1320732.4,
        import : 1087431.3,
        balance : 233301.1
    },
    {		
        country : "Reino Unido",
        year : 2018,
        export : 412055.5,
        import : 570546.8,
        balance : -158491.3
    },
    {		
        country : "Francia",
        year : 2018,
        export : 492964.1,
        import : 572576.0,
        balance : -79611.9
    },
    {		
        country : "Italia",
        year : 2018,
        export : 465325.4,
        import : 426045.7,
        balance : 39279.7
    }
    
];


module.exports.register = (app) =>{

    //GET

    app.get(BASE_API_URL+"/trade-stats",(req,res)=>{
        res.send(JSON.stringify(tradeStats,null,2));
    });
    
    app.get(BASE_API_URL+"/trade-stats/loadInitialData",(req,res)=>{
        if(tradeStats == 0){
            tradeStats.push(loadInitialDataTradeStats);
            res.sendStatus(201,"CREATED");
        }else{
            res.sendStatus(409,"CONFLICT");
        }
    });
        
    app.get(BASE_API_URL+"/trade-stats/docs",(req,res)=>{
        res.redirect(API_DOC_TRADE);
        
    });
        
    app.get(BASE_API_URL+"/trade-stats/:country", (req, res)=>{
        var countryName = req.params.country;
        filteredCountries = tradeStats.filter((c)=>{
            return(c.country == countryName);
        })
        if(filteredCountries == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredCountries[0],null,2));
        }
    
        res.sendStatus(200,"OK");
    
    
    });

    /* 
    
    app.get(BASE_API_URL+"/trade-stats/:year", (req, res)=>{
        var tradeYear = req.params.year;
        var filteredYear = tradeStats.filter((y)=>{
            return(y.year == tradeYear);
        })
        if(filteredYear == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredYear[0],null,2));
        }
        res.sendStatus(200,"OK");
    });

    */
    
    
    //POST
    
    
    app.post(BASE_API_URL+"/trade-stats",(req,res)=>{
        tradeStats.push(req.body);
        res.sendStatus(201,"CREATED");
    });
    
    app.post(BASE_API_URL+"/trade-stats/:country",(req,res)=>{
        var countryName = req.params.country;
        filteredCountries = tradeStats.filter((c)=>{
            return(c.country == countryName);
        });
        if(filteredCountries != 0){
            res.sendStatus(409,"Conflict");
        }else{
            res.sendStatus(405,"Method Not Allowed");
        }
      
    
    });
    
    
    //PUT
    
    
    app.put(BASE_API_URL+"/trade-stats",(req,res)=>{
        res.sendStatus(405,"Method Not Allowed");
    
    })
    
    app.put(BASE_API_URL+"/trade-stats/:country/:year",(req,res)=>{
        if(test_request(req)){
            res.sendStatus(400,"Bad Request");

        }else{
            var countryName = req.params.country;
            var yearReq = req.params.year;
            var body = req.body;
            var pointer = tradeStats.findIndex((reg)=>{
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
                tradeStats[pointer] = new_stat;
                res.sendStatus(200,"Updated");
            }
        }
        
    })
    

    //DELETE
    
    
    app.delete(BASE_API_URL+"/trade-stats/:country", (req, res)=>{
        var countryName = req.params.country;
        tradeStats = tradeStats.filter((c)=>{
            return(c.country!=countryName);
            
        })
        res.sendStatus(200,"OK");
    });
    
     
    app.delete(BASE_API_URL+"/trade-stats", (req, res)=>{
        tradeStats = [];
        res.sendStatus(200,"OK");
    });


    //######

    function test_request(req){
        return (req.body.country == null |
                req.body.year == null |
                req.body.export == null |
                req.body.import == null |
                req.body.balance == null );
    }

};