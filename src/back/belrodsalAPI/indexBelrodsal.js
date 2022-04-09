
const bodyParser = require("body-parser");
const BASE_API_URL = "/api/v1";

var coalStats = [
    {		
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
        country : "mexico",
        year : 2017,
        productions : 12980.80,
        exports : 0,
        consumption : 22705.38
    },
    {		
        country : "china",
        year : 2017,
        productions : 3884057.75,
        exports : 8917.69,
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
    }
];


module.exports = (app,db) =>{

//##########################################
    //GET loadInitialData
    
        app.get(BASE_API_URL+"/coal-stats/loadInitialData",(req,res)=>{
            db.find({}, function (err, filteredList) {
                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
                    return;
                    }
                    if (filteredList == 0) {
                        for (var i = 0; i < coalStats.length; i++) {
                            db.insert(coalStats[i]);
                        }
                        res.send(JSON.stringify(coalStats,null,2));
                    } else {
                        res.send(JSON.stringify(coalStats,null,2));
                    }
                });
        
        })

        
    
        //GET
        app.get(BASE_API_URL+"/coal-stats", (req, res)=>{
        
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
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
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
        
        //REDIRECT
        app.get(BASE_API_URL+"/coal-stats/docs",(req,res)=>{
            res.redirect("https://documenter.getpostman.com/view/19481676/UVyn2ykY");
        
        });
        
        
        
        //GET POR PAIS
        app.get(BASE_API_URL+"/coal-stats/:country", (req, res)=>{
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

        
        //GET PAIS Y AÑO
        app.get(BASE_API_URL+"/coal-stats/:country/:year", (req, res)=>{
            var country =req.params.country
            var year = req.params.year

            db.find({},function(err, r){

                if(err){
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
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
        
        //POST
        
        
        app.post(BASE_API_URL+"/coal-stats", (req,res) => {
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
        });
        
        
        // POST A UN RECURSO CONCRETO (INCORRECTO)
        app.post(BASE_API_URL+"/coal-stats/:country/:year",(req, res)=>{
            res.sendStatus(405,"METHOD NOT ALLOWED");
        });
        
//##########################################
        
        //PUT
        
        
        app.put(BASE_API_URL+"/coal-stats",(req,res)=>{
            res.sendStatus(405,"Method Not Allowed");
        
        })
        
        app.put(BASE_API_URL+"/coal-stats/:country/:year",(req,res)=>{
            if(test_Peticion(req)){
                res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
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
    
                //COMPROBAMOS SI EXISTE EL ELEMENTO
    
                filteredList = filteredList.filter((reg)=>
                {
                    return (reg.country == countryR && reg.year == yearR);
                });
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }
    
                //COMPROBAMOS SI LOS CAMPOS ACTUALIZADOS SON IGUALES
    
                if(countryR != body.country || yearR != body.year){
                    res.sendStatus(400,"BAD REQUEST");
                    return;
                }
    
                //ACTUALIZAMOS VALOR
                    
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
        
        
        app.delete(BASE_API_URL+"/coal-stats/:country", (req, res)=>{
            var countryName = req.params.country;
            registration_stats.filter((cont) => {
                return (cont.country != countryName);
            });
            res.sendStatus(200, "OK");
        });
        
        app.delete(BASE_API_URL+"/coal-stats/:country/:year", (req,res) => {
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
        });
         
        app.delete(BASE_API_URL+"/coal-stats", (req, res)=>{
            db.remove({}, { multi: true }, (err, numRemoved) => {
                if (err) {
                    res.sendStatus(500, "INTERNAL SERVER ERROR");
                    return;
                }
                res.sendStatus(200, "DELETED");
                return;
            });
        });
    


        //FUNCIONES AUX
        function test_Peticion(req){
            return (req.body.country == null |
                    req.body.year == null |
                    req.body.productions == null |
                    req.body.exports == null |
                    req.body.consumption == null );
        }

        function paginacion(req, lista) {

            var res = [];
            const limit = req.query.limit;
            const offset = req.query.offset;
        
            if(limit < 1 || offset < 0 || offset > lista.length){
                res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
                return res;
            }

            res = lista.slice(offset,parseInt(limit)+parseInt(offset));
            return res;
    
        }

};