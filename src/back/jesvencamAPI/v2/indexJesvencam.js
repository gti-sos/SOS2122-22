
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const co = require('co');
const cors = require('cors'); //opciones de cors por defecto para simplificar. 

const generate = require('node-chartist');
app.use(cors());    //Debe de estar antes de registrar alguna ruta. 


const BASE_API_URL = "/api/v2";
const BASE_API_URL_="/api/v2/co2-stats";




//Proxy

var paths='/remoteAPI';
var apiServerHost = 'https://sos2122-22.herokuapp.com/api/v2/co2-stats';

app.use(paths, function(req, res) {
  var url = apiServerHost + req.url;
  console.log('piped: ' + req.url);
  req.pipe(request(url)).pipe(res);
});



var co2 = [{		
    country : "españa",
    year : 2020,
    co2_tot : 214.817,
    co2_kg : 0.13,
    co2_tpc : 4.62
},
{		
    country : "españa",
    year : 2019,
    co2_tot : 255.831,
    co2_kg : 0.13,
    co2_tpc : 5.52
},
{		
    country : "españa",
    year : 2020,
    co2_tot : 275.864,
    co2_kg : 0.15,
    co2_tpc : 5.95
},
{		
    country : "españa",
    year : 2017,
    co2_tot : 280.225,
    co2_kg : 0.15,
    co2_tpc : 6.05
},

{		
    country : "chile",
    year : 2020,
    co2_tot : 214.817,
    co2_kg : 0.13,
    co2_tpc : 4.62
},
{		
    country : "chipre",
    year : 2020,
    co2_tot : 214.817,
    co2_kg : 0.13,
    co2_tpc : 4.62
},
{		
    country : "uruguay",
    year : 2020,
    co2_tot : 214.817,
    co2_kg : 0.13,
    co2_tpc : 4.62
},
{		
    country : "holanda",
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
    year : 2020,
    co2_tot :636.876,
    co2_kg : 0.15,
    co2_tpc : 7.72
},

{
    country : "alemania",
    year : 2019,
    co2_tot : 702.201,
    co2_kg : 0.16,
    co2_tpc : 8.52
},
{
    country : "alemania",
    year : 2018,
    co2_tot : 757.343,
    co2_kg : 0.17,
    co2_tpc : 9.20
},
{
    country : "francia",
    year : 2020,
    co2_tot : 279.991,
    co2_kg : 0.16,
    co2_tpc : 8.52
},
];


module.exports.register = (app,db) =>{

    // Postaman documentation 
    app.get(BASE_API_URL+"/co2-stats/docs",(req,res)=>{
        res.redirect("https://documenter.getpostman.com/view/19481636/UVyvwuou");
    
    });
    app.get(BASE_API_URL+ "/co2-stats/data",(req,res)=>{
        res.send(JSON.stringify([1234,2345,3456,4567,5678]))
    })
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
                
            db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
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

    app.delete(BASE_API_URL_+"/:country/:year",(req, res)=>{
        var countryR = req.params.country;
        var yearR = req.params.year;

        db.find({country: countryR, year: parseInt(yearR)}, {}, (err, filteredList)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            if(filteredList==0){
                res.sendStatus(404,"NOT FOUND");
                return;
            }
            db.remove({country: countryR, year: parseInt(yearR)}, {}, (err, numRemoved)=>{
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




