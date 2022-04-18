const bodyParser = require("body-parser");

const BASI_API_tradeStats = "/api/v2/trade-stats";



var tradeStats = [
    {		
        country : "spain",
        year:2005,
        export:123456,
        import:63.70,
        balance:49070.43
    },
    {
        country:"australia",
        year:2005,
        export:21474.10,
        import:1754.70,
        balance:0
    },{		
        country : "china",
        year : 2005,
        export : 2607124.00,
        import : 79068.70,
        balance : 0
    },
    {		
        country : "mexico",
        year : 2017,
        export : 12980.80,
        import : 0,
        balance : 22705.38
    },
    {		
        country : "china",
        year : 2017,
        export : 3884057.75,
        import : 8917.69,
        balance : 0
    },
    {
        country : "eeuu",
        year : 2005,
        export : 1131498.13,
        import : 49942.21,
        balance : 0
    },{		
        country : "india",
        year : 2005,
        export : 473265.78,
        import : 1754.75,
        balance : 0
    }
]

module.exports.register = (app,db) =>{
    /* 
        API para tradeStats
    */
    
    // Cargar datos iniciales
    
    app.get(BASI_API_tradeStats+"/loadInitialData",(req, res)=>{

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            if (filteredList==0){
                for(var i = 0; i<tradeStats.length;i++){
                    db.insert(tradeStats[i]);
                }
                res.sendStatus(200, "OK.")
                return;
            }else{
                res.sendStatus(200, "Ya inicializados")
            }
        });
        
    })
    
    // Documentos
    
    app.get(BASI_API_tradeStats+"/docs",(req,res)=>
    {
        res.redirect("https://documenter.getpostman.com/view/19996738/UVysxGDk")
    })
    
    // GETs
    
    // GET global y GET por año
    
    app.get(BASI_API_tradeStats,(req, res)=>{
    
        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if(from>to){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            // Apartado para búsqueda por año
            
            if(year != null){
                var filteredList = filteredList.filter((reg)=>
                {
                    return (reg.year == year);
                });
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }
            }
    
            // Apartado para from y to
            
            if(from != null && to != null){
                filteredList = filteredList.filter((reg)=>
                {
                    return (reg.year >= from && reg.year <=to);
                });
    
                if (filteredList==0){
                    res.sendStatus(404, "NO EXISTE");
                    return;
                }    

                
            }
            // RESULTADO
    
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "export" && element != "import" && element != "balance "){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList,null,2));
        })
    })
    
    // GET por país
    
    app.get(BASI_API_tradeStats+"/:country",(req, res)=>{
    
        var country =req.params.country;
        var from = req.query.from;
        var to = req.query.to;

        //Comprobamos query

        for(var i = 0; i<Object.keys(req.query).length;i++){
            var element = Object.keys(req.query)[i];
            if(element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset" && element != "fields"){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        }

        //Comprobamos si from es mas pequeño o igual a to
        if(from>to){
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        db.find({}, function(err,filteredList){
            
            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == country);
            });
        
            // Apartado para from y to
            var from = req.query.from;
            var to = req.query.to;
    
            //Comprobamos si from es mas pequeño o igual a to
            if(from>to){
                res.sendStatus(400, "BAD REQUEST");
                return;
            }
        
            if(from != null && to != null && from<=to){
                filteredList = filteredList.filter((reg)=>
                {
                   return (reg.year >= from && reg.year <=to);
                }); 
                
            }
            //COMPROBAMOS SI EXISTE
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
            //RESULTADO
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "export" && element != "import" && element != "balance "){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList,null,2));
        })

    })
    
    // GET por país y año
    
    app.get(BASI_API_tradeStats+"/:country/:year",(req, res)=>{
    
        var country =req.params.country
        var year = req.params.year

        db.find({},function(err, filteredList){

            if(err){
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }

            filteredList = filteredList.filter((reg)=>
            {
                return (reg.country == country && reg.year == year);
            });
            if (filteredList==0){
                res.sendStatus(404, "NO EXISTE");
                return;
            }
    
            //RESULTADO
    
            //Paginación
            if(req.query.limit != undefined || req.query.offset != undefined){
                filteredList = paginacion(req,filteredList);
                res.send(JSON.stringify(filteredList,null,2));
            }
            filteredList.forEach((element)=>{
                delete element._id;
            });

            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listaFields = req.query.fields.split(",");
                for(var i = 0; i<listaFields.length;i++){
                    var element = listaFields[i];
                    if(element != "country" && element != "year" && element != "export" && element != "import" && element != "balance "){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = comprobar_fields(req,filteredList);
            }

            res.send(JSON.stringify(filteredList[0],null,2));
        });

    })
    
    // POSTs
    
    // POST para lista de recursos
    
    app.post(BASI_API_tradeStats,(req, res)=>{
        
        if(comprobar_body(req)){
            res.sendStatus(400,"BAD REQUEST - Parametros incorrectos");
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
    
    app.post(BASI_API_tradeStats+"/:country",(req, res)=>{
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    
    // PUTs
    
    // PUT de una lista de recursos
    
    app.put(BASI_API_tradeStats,(req, res)=>{
        
        res.sendStatus(405,"METHOD NOT ALLOWED");
    })
    
    // PUT de un recurso especifico
    
    app.put(BASI_API_tradeStats+"/:country/:year",(req, res)=>{
        
        //COMPROBAMOS FORMATO JSON

        if(comprobar_body(req)){
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
    
    // DELETEs
    
    // DELETE de una lista de recursos
    
    app.delete(BASI_API_tradeStats,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            res.sendStatus(200,"DELETED");
            return;
        });
    })
    
    // DELETE de un recurso especifico
    
    app.delete(BASI_API_tradeStats+"/:country/:year",(req, res)=>{
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
    
    // Método auxiliares
    
    function comprobar_body(req){
        return (req.body.country == null |
                 req.body.year == null | 
                 req.body.export == null | 
                 req.body.import == null | 
                 req.body.balance  == null);
    }

    function paginacion(req, lista){

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

    function comprobar_fields(req, lista){
        var fields = req.query.fields;

        var contieneCountry = false;
        var contieneYear = false;
        var contiene_export = false;
        var contiene_import = false;
        var contiene_balance  = false;
        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='country'){
                contieneCountry=true;
            }
            if(element=='year'){
                contieneYear=true;
            }
            if(element=='export'){
                contiene_export=true;
            }
            if(element=='import'){
                contiene_import=true;
            }
            if(element=='balance '){
                contiene_balance =true;
            }
        }

        //Country
        if(!contieneCountry){
            lista.forEach((element)=>{
                delete element.country;
            })
        }

        //Year
        if(!contieneYear){
            lista.forEach((element)=>{
                delete element.year;
            })
        }

        //export
        if(!contiene_export){
            lista.forEach((element)=>{
                delete element.export;
            })
        }

        //import
        if(!contiene_import){
            lista.forEach((element)=>{
                delete element.masters_finals;
            })
        }

        //balance 
        if(!contiene_balance ){
            lista.forEach((element)=>{
                delete element.balance ;
            })
        }

        return lista;

    }


}