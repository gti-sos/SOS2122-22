<script>
    import { onMount } from "svelte";
    import Button from 'sveltestrap/src/Button.svelte';
    import Highcharts from "highcharts";
    import more from 'highcharts/highcharts-more';
    more(Highcharts);
    
    

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
                type: 'columnpyramid'
                
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
                            verticalAlign: 'top'
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
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://github.highcharts.com/master/modules/exporting.js" on:load="{loadGraph}"></script>
    
</svelte:head>


<figure class="highcharts-figure">
    <div id="container"></div>
    
</figure>