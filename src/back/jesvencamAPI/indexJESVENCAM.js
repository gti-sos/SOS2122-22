const bodyParser = require("body-parser");
const BASE_API_URL = "/api/v1";
const BASE_API_URL_="/api/v1/co2-stats";

var co2 = [{		
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
}];


module.exports.register = (app,db) =>{

    // Postaman documentation 
    app.get(BASE_API_URL+"/co2-stats/docs",(req,res)=>{
        res.redirect("https://documenter.getpostman.com/view/19481636/UVyvwuou");
    
    });
    app.get(BASE_API_URL+ "/co2-stats/loadInitialData", (req, res) => {
        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
                }
                if (filteredList == 0) {
                    for (var i = 0; i < co2.length; i++) {
                        db.insert(co2[i]);
                    }
                    res.send(JSON.stringify(co2,null,2));
                } else {
                    res.send(JSON.stringify(co2,null,2));
                }
            });

        })

        app.get(BASE_API_URL + "/co2-stats",(req, res)=>{
        
            var year = req.query.year;
            var from = req.query.from;
            var to = req.query.to;

            for(var i = 0; i<Object.keys(req.query).length;i++){
                var element = Object.keys(req.query)[i];
                if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }
            if(from>to){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            db.find({},function(err, r){

                if(err){
                    res.sendStatus(500, "");
                    return;
                }

                if(year != null){
                    var r = r.filter((reg)=>
                    {
                        return (reg.year == year);
                    });
                    if (r==0){
                        res.sendStatus(404, "NOT FOUND ");
                        return;
                    }
                }
        
                if(from != null && to != null){
                    r = r.filter((reg)=>
                    {
                        return (reg.year >= from && reg.year <=to);
                    });
        
                    if (r==0){
                        res.sendStatus(404, "NOT FOUND ");
                        return;
                    }    

                    
                }   
                if(req.query.limit != undefined || req.query.offset != undefined){
                    r = paginacion(req,r);
                }
                r.forEach((element)=>{
                    delete element._id;
                });
                res.send(JSON.stringify(r,null,2));
            })
        });



        // por pais 
        app.get(BASE_API_URL + "/co2-stats/:country",(req, res)=>{
        
            var country =req.params.country;
            var year = req.year;
            var from = req.query.from;
            var to = req.query.to;

            for(var i = 0; i<Object.keys(req.query).length;i++){
                var element = Object.keys(req.query)[i];
                if(element != "from" && element != "to"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }

            if(from>to){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            db.find({}, function(err,r){
                
                if(err){
                    res.sendStatus(500);
                    return;
                }

                r = r.filter((reg)=>
                {
                    if (year == null){
                        return (reg.country == country);
                    }else{
                        return (reg.country == country);

                    }
                });
            
                var from = req.query.from;
                var to = req.query.to;
        
                if(from>to){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            
                if(from != null && to != null && from<=to){
                    r = r.filter((reg)=>
                    {
                    return (reg.year >= from && reg.year <=to);
                    }); 
                    
                }
                if (r==0){
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }
                //RESULTADO
                if(req.query.limit != undefined || req.query.offset != undefined){
                    r = paginacion(req,r);
                }
                r.forEach((element)=>{
                    delete element._id;
                });
                res.send(JSON.stringify(r,null,2));
            })

        });

        app.get(BASE_API_URL+"/co2-stats/:country/:year",(req, res)=>{
        
            var country =req.params.country
            var year = req.params.year

            db.find({},function(err, r){

                if(err){
                    res.sendStatus(500, "");
                    return;
                }

                r = r.filter((reg)=>
                {
                    return (reg.country == country && reg.year == year);
                });
                if (r==0){
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }
        
                //RESULTADO
        
                //Paginación
                if(req.query.limit != undefined || req.query.offset != undefined){
                    r = paginacion(req,r);
                    res.send(JSON.stringify(r,null,2));
                }
                r.forEach((element)=>{
                    delete element._id;
                });
                res.send(JSON.stringify(r[0],null,2));
            });

        });

    


    
        //##########################################


        //Metodo aux 

        function test_Peticion(req) {
            console.log(req.body)
            return (req.body.country == undefined |
                req.body.year == null |
                req.body.co2_kg == null |
                req.body.co2_tot == null |
                req.body.co2_tpc == null);
        }

    // POST para lista de recursos
    
    app.post(BASE_API_URL_,(req, res)=>{
        
        if(test_Peticion(req)){
            res.sendStatus(400,"BAD REQUEST");
        }else{

            db.find({},function(err,filteredList){

                if(err){
                    res.sendStatus(500, "ERROR EN CLIENTE");
                    return;
                }

                filteredList = filteredList.filter((reg)=>
                {
                    return(req.body.country == reg.country && req.body.year == reg.year)
                })
            
                if(filteredList.length != 0){
                    res.sendStatus(409,"CONFLICT");
                }else{
                    db.insert(req.body);
                    res.sendStatus(201,"CREATED");
                }
            })
        }
    
    })
    
    // POST para recurso concreto
    
    app.post(BASE_API_URL_+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    
    // PUT de una lista de recursos
    
    app.put(BASE_API_URL_,(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    // PUT de un recurso especifico
    
    app.put(BASE_API_URL_+"/:country/:year",(req, res)=>{
        
        //COMPROBAMOS FORMATO JSON

        if(test_Peticion(req)){
            res.sendStatus(400,"BAD REQUEST");
            return;
        }
        
        var countryR = req.params.country;
        var yearR = req.params.year;
        var body = req.body;  

        db.find({},function(err,filteredList){
            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == countryR && reg.year == yearR);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }


            if(countryR != body.country || yearR != body.year){
                res.sendStatus(400,"BAD REQUEST");
                return;
            }

        
                
            db.update({country: countryR, year: yearR }, {$set: body}, {},function(err, updatedDb) {
                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                }else{
                    res.sendStatus(200,"UPDATED");
                }
            });
        })
    
    })
    
    
    //##########################################
    //DELETE
    app.delete(BASE_API_URL+"/co2-stats",(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "INTERNAL SERVER ERROR");
                return;
            }
            res.sendStatus(200, "DELETED");
            return;
        });
    })
    
    app.delete(BASE_API_URL + "/co2-stats/:country", (req, res) => { 
        var countryName = req.params.country;
        co2.filter((cont) => {
            return (cont.country != countryName);
        });
        res.sendStatus(200, "OK");
    });

    app.delete(BASE_API_URL + "/co2-stats/:country/:year",(req, res)=>{
        var countryR = req.params.country;
        var yearR = req.params.year;

        db.find({country: countryR, year: parseInt(yearR)}, {}, (err, regisNew)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            if(regisNew==0){
                res.sendStatus(404,"NOT FOUND");
                return;
            }
            db.remove({country: countryR, year: yearR}, {}, (err, numRemoved)=>{
                if (err){
                    res.sendStatus(500,"ERROR EN CLIENTE");
                    return;
                }
            
                res.sendStatus(200,"DELETED");
                return;
                
            });
        });

    })

        
    //Función paginación 
    function paginacion(req, lista){

        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > lista.length){
            res.push("BAD PARAMS");
            return res;
        }

        res = lista.slice(offset,parseInt(limit)+parseInt(offset));
        return res;

    }
}