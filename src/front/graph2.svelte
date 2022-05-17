<script>
    import Button from "sveltestrap/src/Button.svelte";
    import Highcharts from "highcharts";
    let datos = [];
    let fechas = [];
    let co2_tot = [];
    let co2_tpc = [];
    let co2_kg = [];
    async function loadGraph(){
        const res = await fetch("/api/v2/co2-stats");
        if(res.ok){
            datos = await res.json();
            console.log(datos);
            console.log(JSON.stringify(datos, null, 2))
            datos.forEach(data => {
                fechas.push(data["country"] + "-" + data.year);
                co2_tot.push(data.co2_tot);
                co2_tpc.push(data.co2_tpc);
                co2_kg.push(data.co2_kg);   
            });
        }else{
            window.alert("No hay datos para este pais");
            console.log("ERROR EN LA PETICION DE LOS DATOS ");
            window.location.href = `/#/co2StatsTable`;
        }
        Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Grafico Grupo 22 '
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
        data: co2_tot,
    },{
        name: 'C02 por 1000 Dolares del PIB',
        data: co2_tpc,
    },{
        name: 'C02 toneladas per capita',
        data: co2_kg,
    },],
    });
  }
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
    <Button id='back' outline color="secondary" onclick="window.location.href='#/co2StatsTable'">Volver</Button>
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