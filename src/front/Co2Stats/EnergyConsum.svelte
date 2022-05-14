<script>

    import {onMount} from'svelte';
  
    let apiData = [];
    let fechas =[];
    let datos =[];
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function getData(){
        const res = await fetch("api/v2/co2-stats/loadInitialData");
        if (res.ok){
            const json = await res.json();
            console.log("datos cargados..."+JSON.stringify(json));
            apiData = json;
            guardaD1(json);
            console.log("cargando el grafo con los datos nuevos"+apiData);
            const res1 = await fetch("https://sos2122-31.herokuapp.com/api/v2/registration-stats/loadInitialData");
            const res2 = await fetch("https://sos2122-10.herokuapp.com/api/v2/registration-stats/loadInitialData");
            if (res1.ok){    
                const json = await res1.json();
                console.log("datos cargados..."+JSON.stringify(json));
                apiData = json;
                datos.forEach(data => {
                    fechas.push(data["country"] + "-" + data.year);
                    });
                guardaD(json);
                console.log("cargando el grafo con los datos nuevos"+apiData);

                await delay(1000);
                loadGraph();
            
            }else{
                console.log("Error en la peticion de los datos iniciales para el grafico");

                
            }
    
    }else{
        console.log("Error en la peticion de los datos iniciales para el grafico");

            
    }
}

    let tpc = [];
    let kg = [];
    let tot = [];
    async function guardaD1(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].co2_kg);
                kg.push(aux);

                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].co2_tot);
                tot.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].co2_tpc);
                tpc.push(aux);
            }
    }

    let nivelTerciario = [];
    let nivelPrimario = [];
    let nivelSecundario = [];

    let categorias = [];
    let total = [];
    let nrenewable = [];
    let renewable = [];
    async function guardaD(json){
        for(let i = 0; i<json.length; i++){
                total.push(json[i].percentages_access_elecetricity);
                nrenewable.push(json[i].non_renewable_energy_consumptions);
                renewable.push(json[i].renewable_energy_consumptions);
            }
    }


    async function loadGraph(){
        Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Integracion de los datos de consumo de energia y de Co2'
        },
        xAxis: {
            categories: fechas,
            title: {
                text: 'Pais y Año'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Valores',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip:{
            split: true,
            valueSuffix: "%",
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -70,
            y: 90,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Emisiones totales de C02',
            data: tot,
        },{
            name: 'C02 por 1000 Dolares del PIB',
            data: tpc,
        },{
            name: 'C02 toneladas per capita',
            data: kg,
        },{
            name: 'Energia consumida total',
            data: total,
        },{
            name: 'Energia no renovable',
            data: nrenewable,
        },{
            name: 'Energía renovable',
            data: renewable,
        }],
        });
  }

  onMount(getData);

</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"  on:load="{loadGraph}"></script>
    
   
</svelte:head>

<main>        
    <br>
    <br>
        <div style="margin:auto;"> 
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
              Grafico acerca de la produccion de CO2 por pais y año 
            </p>
        </figure>  
 </main>
    
    
<style>
        .highcharts-figure {
          min-width: 100%;
          max-width:100%;
          margin: 1em auto;
        }
        #container {
          height: 600px;
        }
        
</style>