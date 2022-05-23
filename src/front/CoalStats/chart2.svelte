<script>
    import { onMount } from "svelte";
    import Button from 'sveltestrap/src/Button.svelte';
    import Highcharts from "highcharts";

 



    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let stats_country_date = [];
    let stats_productions = [];
    let stats_exports = [];
    let stats_consumption = [];


    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/coal-stats");
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_country_date.push(stat.country + "-" + stat.year);
                stats_productions.push(stat["productions"]);
                stats_exports.push(stat["exports"]);
                stats_consumption.push(stat["consumption"]);             
            });
            loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
    }
    async function loadGraph() {
        Highcharts.chart('container', {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Datos sobre el carbón'
            },
            subtitle: {
                text: 'Biblioteca: Highcharts'
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
            xAxis: {
                title: {
                    text: "País-Año",
                },
                categories: stats_country_date,
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            
            series: [
                {
                name: 'Producciones totales',
                data: stats_productions
                },
                {
                name: 'Exportaciones',
                data: stats_exports
                },
                {
                name: 'Consumo',
                data: stats_consumption
                },
            ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
       
       
    }
    onMount(getStats);
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
    <Button id='back' outline color="secondary" onclick="window.location.href='#/coalStatsTable'">Volver</Button>
        <div style="margin:auto;"> 
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
              Grafico acerca de los datos del Carbón
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