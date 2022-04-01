const bodyParser = require("body-parser");
const BASE_API_URL = "/api/v1";


var co2 = [];



module.exports.register = (app) =>{
    
    // Postaman documentation 
    app.get(BASE_API_URL+"/co2-stats/docs",(req,res)=>{
        res.redirect("https://documenter.getpostman.com/view/19481636/UVyrVwjh");
    
    });

    // Create data if arry is empty 
    app.get(BASE_API_URL+"/co2-stats/loadInitialData",(req,res)=>{
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
                country : "luxemburgo",
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
            },
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
            },
            {		
                country : "spain",
                year : 2022,
                co2_tot : 214.817,
                co2_kg : 0.13,
                co2_tpc : 4.62
            })
    
        }
        res.send(JSON.stringify(co2,null,2));
    
    });
    
  
    app.get(BASE_API_URL+"/co2-stats", (req, res)=>{
        
        if(co2 == []){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(co2,null,2));
        }
    
        res.sendStatus(200,"OK");
    });
    
    //POR PAIS 
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

    // POR PAIS Y AÑO 
    app.get(BASE_API_URL+"/co2-stats/:country/:year", (req, res)=>{
        var countryName = req.params.country;
        var year = req.params.year;
        filteredCountriesYears = co2.filter((c)=>{
            return(c.country == countryName && c.year == year);
        })
        if(filteredCountriesYears == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredCountriesYears[0],null,2));
        }
    
        res.sendStatus(200,"OK");
    });

    //Para buscar SOLO por año 
    app.get(BASE_API_URL+"/co2-stats?:year", (req, res)=>{
        var year = req.params.year;
        filteredCO2Years = co2.filter((c)=>{
            return (c.year == year);
        });
    
        if(filteredCO2Years == 0){
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.status(200);
            res.send(JSON.stringify(filteredCO2Years,null,2)); 
    
        }
    });

    app.get(BASE_API_URL+"/co2-stats?:co2_tot", (req, res)=>{
        var co2_tot = req.params.co2_tot;
        filteredCO2tot = co2.filter((c)=>{
            return (c.co2_tot == co2_tot);
        });
    
        if(filteredCO2tot == 0){
            res.sendStatus(404, "NOT FOUND");
        }else{
            res.status(200);
            res.send(JSON.stringify(filteredCO2tot[0],null,2)); 
    
        }
    });
    
    
    //##########################################
    
    //POST
    
    //Create a new resource 
    app.post(BASE_API_URL+"/co2-stats",(req,res)=>{
        var rep = false;
        var countryName = req.body.country;
        filteredCountries = co2.filter((c)=>{
            return(c.country == countryName);
        });
        if(filteredCountries == 0){
            
            var c = req.body.country!=undefined;
            var y = req.body.year!=undefined;
            var co2_kg = req.body.co2_kg!=undefined;
            var co2_tot= req.body.co2_tot!=undefined;
            var co2_tpc = req.body.co2_tpc!=undefined;

            var cumple = c && y && co2_kg && co2_tot && co2_tpc

            if(cumple){

                for(elemento in co2){
                    rep = rep || ( co2[elemento].country===String(req.body.country) && co2[elemento].year===parseInt(req.body.year));
                }

                if(rep){
                    res.sendStatus(409);
                    console.log("Repeat Element");
                }
                else{
                    co2.push(req.body);
                    res.sendStatus(201);
                }
            }
            else{
                res.sendStatus(400,"Uncomplete Data"); //BAD REQUEST
            }                  
        }else{
            res.sendStatus(405,"Method Not Allowed");
            //If the resource exist, not allow
        }

    });
    
    //Post to an existing resource or use a resource like a collection
    app.post(BASE_API_URL+"/co2-stats/:country",(req,res)=>{
        var countryName = req.params.country;
        filteredCountries = co2.filter((c)=>{
            return(c.country == countryName);
        });
        if(filteredCountries == 0){
            res.sendStatus(409,"Conflict");
            
        }else{
            res.sendStatus(405,"Method Not Allowed");
            //If the resource exist, not allow
        }
    });


    
    //##########################################
    
    //PUT
    
    //Put no allowed under a resource list 
    app.put(BASE_API_URL+"/co2-stats",(req,res)=>{
        res.sendStatus(405,"Method Not Allowed");
    
    });
    

    app.put(BASE_API_URL+"/co2-stats/:country/:year",(req,res)=>{
        if(test_Peticion(req)){
            res.sendStatus(400,"Bad Request");

        }else{
            var countryName = req.params.country;
            var yearReq = req.params.year;
            var body = req.body;
            var pointer = co2.findIndex((reg)=>{
                return (reg.country == countryName && reg.year == yearReq)
            });
            if(pointer == null){
                res.sendStatus(404,"Not Found");
            }else if(countryName !=body.country || yearReq !=body.year){
                res.sendStatus(400,"Bad Request, the new data are incorrects");
            
            
            }else if(countryName == body.country && yearReq !=body.year){
                res.sendStatus(404,"Not Found");
            }else{
                var new_stat = {...body};
                co2[pointer] = new_stat;
                res.sendStatus(200,"Updated");
            }
        }
        
    });
    
    
    //##########################################
    //DELETE
    
    //Delete an element by countryName
    app.delete(BASE_API_URL+"/co2-stats/:country", (req, res)=>{

        var countryName = req.params.country;
        filteredCountries = co2.filter((c)=>{
            return(c.country == countryName);
        })
        if(filteredCountries == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            co2 = co2.filter((c)=>{
                return (c.country != countryName)});
            res.sendStatus(200,"OK");
        }
       
    });
/*
    app.delete(BASE_API_URL +"co2-stats/:country/:year", (req, res)=>{
        var countryName = req.params.country;
        var year = req.params.year;

        filteredCountries = co2.filter((c)=>{
            return(c.country == countryName && c.year == year);
        })
        if(filteredCountries == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            co2 = co2.filter((c)=>{
                return (c.country != countryName || c.year != year)
                });
            res.sendStatus(200,"OK");
        }
         

    });

    */
    
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