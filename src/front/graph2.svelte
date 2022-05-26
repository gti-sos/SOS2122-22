<script>
    import Button from "sveltestrap/src/Button.svelte";
    import Highcharts from "highcharts";






    //-----------------------------------------

    let datos = [];
    let fechas = [];
    let co2_tot = [];
    let co2_tpc = [];
    let co2_kg = [];

    let datos1=[];
    let stats_country_date = [];
    let stats_productions = [];
    let stats_exports = [];
    let stats_consumption = [];

    let datos2=[];
    let stats_country_date_trade = [];
    let stats_imports = [];
    let stats_exports_trade = [];
    let stats_balance = [];

    async function loadGraph(){
        const res = await fetch("/api/v2/co2-stats");
        const res1 = await fetch("/api/v2/coal-stats");
        const res2 = await fetch("/api/v2/trade-stats");
        if(res.ok){
            datos = await res.json();
            datos1 = await res1.json();
            datos2 = await res2.json();

            console.log(datos);
            console.log(JSON.stringify(datos, null, 2))
            datos.forEach(data => {
                fechas.push(data.country + "-" + data.year);
                co2_tot.push(data.co2_tot);
                co2_tpc.push(data.co2_tpc);
                co2_kg.push(data.co2_kg);
                   
            })
          
            console.log(datos1);
            console.log(JSON.stringify(datos1, null, 2))
            datos1.forEach(stat => {
                stats_country_date.push(stat.country + "-" + stat.year);
                stats_productions.push(stat["productions"]);
                stats_exports.push(stat["exports"]);
                stats_consumption.push(stat["consumption"]); 
            });

            console.log(datos2);
            console.log(JSON.stringify(datos2, null, 2))
            datos2.forEach(stat => {
                stats_country_date_trade.push(stat.country + " " + stat.year);
                stats_imports.push(stat["import"]);
                stats_exports_trade.push(stat["export"]);
                stats_balance.push(stat["balance"]);      
                   
            })

        }else{
            window.alert("No hay datos para este pais");
            console.log("ERROR EN LA PETICION DE LOS DATOS ");
            window.location.href = `/#/co2StatsTable`;
        }

        /*
        Highcharts.chart('container', {
            chart:{
                type:'area'
            },

            title: {
                text: 'Grafico del equipo 22'
            },

            subtitle: {
                text: ''
            },

            yAxis: {
                title: {
                    text: 'valor'
                }
            },

            xAxis: {
        categories: stats_country_date,
        title: {
            text: 'Pais y Año'
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
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2010
                }
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
    },
    {
        name: 'Producciones totales de Carbón',
        data: stats_productions,
    },
    {
        name: 'Exportaciones totales de Carbón',
        data: stats_exports,
    },
    {
        name: 'Consumo total de Carbón',
        data: stats_consumption,
    },
],
    });
  }
        */
        Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Grafico Grupo 22 '
    },
    xAxis: {
        categories: stats_country_date.concat(fechas.concat(stats_country_date_trade)),
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
        name: 'Importaciones',
        data: stats_imports
    },
    {
        name: 'Exportaciones',
        data: stats_exports_trade
    },
    {
        name: 'Balance',
        data: stats_balance
    },{
        name: 'Emisiones totales de C02',
        data: co2_tot,
    },{
        name: 'C02 por 1000 Dolares del PIB',
        data: co2_tpc,
    },{
        name: 'C02 toneladas per capita',
        data: co2_kg,
    },
    {
        name: 'Producciones totales de Carbón',
        data: stats_productions,
    },
    {
        name: 'Exportaciones totales de Carbón',
        data: stats_exports,
    },
    {
        name: 'Consumo total de Carbón',
        data: stats_consumption,
    },
],
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
    <Button id='back' outline color="secondary" onclick="window.location.href='#/info'">Volver</Button>
        <div style="margin:auto;"> 
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
              Grafico acerca de la produccion de CO2 por pais y año y los datos de producción, exportación y consumo del carbón.
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