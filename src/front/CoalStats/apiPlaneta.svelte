<script>
    import { onMount } from "svelte";
    import Button from 'sveltestrap/src/Button.svelte';
    import Highcharts from "highcharts";

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let stats_name = [];
    let stats_distance = [];


	
    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/apiIntegradaPlaneta");
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_name.push(stat.name);
                stats_distance.push(stat["distance"]);
				
            });
            console.log(stats_name,stats_distance);
            loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
    }
    async function loadGraph() {
        console.log("hola",stats_name,stats_distance);
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Datos sobre la distancia a años luz de la tierra'
            },
            subtitle: {
                text: 'Biblioteca: Highcharts'
            },
            yAxis: {
                title: {
                    text: 'Distancia a años luz'
                },
                
            },
            xAxis: {
                title: {
                    text: "nombre de la estrella",
                },
                categories: stats_name,
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            
            series: [
                {
                name: 'Distancia a años luz',
                data: stats_distance.map(x=>Number(x)) //Convertirlo a numero porque eran strings
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
              Grafico acerca de las distancias a años luz de las estrellas
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