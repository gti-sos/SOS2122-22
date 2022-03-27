const bodyParser = require("body-parser");
const BASE_API_URL = "/api/v1";


var co2 = [
    {		
        country : "spain",
        year : 2020,
        co2_tot : 214.817,
        co2_kg : 0.13,
        co2_tpc : 4.62
    },
    {
        country : "alemania",
        year : 2017,
        co2_tot : 250.177,
        co2_kg : 0.15,
        co2_tpc : 4.77
    }
];



module.exports = (app) =>{

    //Cargar datos iniciales en caso de que este vacío
    app.get(BASE_API_URL+"/co2-stats/loadInitalData",(req,res)=>{
        if(co2.length==0){
            co2.push({		
                country : "mexico",
                year : 2020,
                co2_tot : 214.817,
                co2_kg : 0.13,
                co2_tpc : 4.62
            },
            {
                country : "italia",
                year : 2017,
                co2_tot : 250.177,
                co2_kg : 0.15,
                co2_tpc : 4.77
            },{		
                country : "francia",
                year : 2020,
                co2_tot : 214.817,
                co2_kg : 0.13,
                co2_tpc : 4.62
            },
            {
                country : "rusia",
                year : 2017,
                co2_tot : 250.177,
                co2_kg : 0.15,
                co2_tpc : 4.77
            },{		
                country : "spain",
                year : 2020,
                co2_tot : 214.817,
                co2_kg : 0.13,
                co2_tpc : 4.62
            },
            {
                country : "alemania",
                year : 2017,
                co2_tot : 250.177,
                co2_kg : 0.15,
                co2_tpc : 4.77
            })
    
        }
        res.send(JSON.stringify(co2,null,2));
    
    });



    app.get(BASE_API_URL+"/co2-stats/docs",(req,res)=>{
        res.redirect("https://documenter.getpostman.com/view/19481636/UVsTphXD");
    
    });
    
    app.get(BASE_API_URL+"/co2-stats/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    
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
    
    //POST
    
    
    app.post(BASE_API_URL+"/co2-stats",(req,res)=>{
        co2.push(req.body);
        res.sendStatus(201,"CREATED");
    
    });
    
    app.post(BASE_API_URL+"/co2-stats/:country",(req,res)=>{
        var countryName = req.params.country;
        filteredCountries = co2.filter((c)=>{
            return(c.country == countryName);
        });
        if(filteredCountries == 0){
            res.sendStatus(409,"Conflict");
        }else{
            res.sendStatus(405,"Method Not Allowed");
        }
      
    
    });
    
    //##########################################
    
    //PUT
    
    //Put a una lista de recursos (no permitido)
    app.put(BASE_API_URL+"/co2-stats",(req,res)=>{
        res.sendStatus(405,"Method Not Allowed");
    
    })
    
    app.put(BASE_API_URL+"/co2-stats/:country/:year",(req,res)=>{
        if(test_Peticion(req)){
            res.sendStatus(400,"Bad Request");

        }else{
            var countryName = req.params.country;
            var yearReq = req.params.year;
            var body = req.body;
            var pointer = co2.findIndex((reg)=>{
                return (reg.country == countryName && reg.year == year)
            })
            filteredCountryYear = co2.filter((c)=>{
                return(c.country == countryName && c.year == yearReq);
            });
            if(pointer == null){
                res.sendStatus(400,"Not Found");
            }else if(countryName !=body.country || year !=body.year){
                res.sendStatus(400,"Bad Request");
            }else{
                var new_stat = {...body};
                co2[pointer] = new_stat;
                res.sendStatus(200,"Updated");
            }
        }
        
    })
    
    
    //##########################################
    //DELETE
    
    
    app.delete(BASE_API_URL+"/co2-stats/:country", (req, res)=>{
        var countryName = req.params.country;
        co2.filter((c)=>{
            return(c.country!=countryName);
            co2.pop()
        })
        res.sendStatus(200,"OK");
    });
    
    //ESTO BORRA TODOS LOS RECURSO  
    app.delete(BASE_API_URL+"/co2-stats", (req, res)=>{
        co2 = [];
        res.sendStatus(200,"OK");
    });
    


    //Metodo aux 

    function test_Peticion(req){
        return (req.body.country == null |
                req.body.year == null |
                req.body.co2_tot == null |
                req.body.co2_kg == null |
                req.body.co2_tpc == null );
    }
    
}