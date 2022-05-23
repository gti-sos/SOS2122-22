<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let stats_name = [];
    let stats_points = [];

	let myChart;

	
    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/apiIntegrada");
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_name.push(stat.datetime);
                stats_points.push(stat["aqi"]);
				console.log(stats_name,stats_points);
            });
            loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
    }
    async function loadGraph() {
        var ctx = document.getElementById("myChart2").getContext("2d");
		let myChart;
        if(myChart){
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: "radar",
            
            data: {
                labels: stats_name.slice(0, 10),
                datasets: [
                    {
                        label: "Calidad del Aire",
						
                        backgroundColor: "rgba(178,218,250,0.5)",
                        borderColor: "rgb(178,218,250)",
                        data: stats_points.slice(0, 10),
                    },
                ],
            },
            
        });
    }
    onMount(getStats);
</script>

<svelte:head>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.js"
        on:load={loadGraph}></script>
</svelte:head>

<main>
    <h2>Aire en Distintas horas de Sevilla</h2>
    <h4>Biblioteca: Chart.js</h4>
    <!--<button class="btn btn-primary hBack" type="button">Volver</button>
    <a href="/#/tennis" class="btn btn-primary hBack" role="button" >Volver</a> -->
    <a
        href="/#/integrations"
        class="btn btn-primary btn-lg active"
        role="button"
        aria-pressed="true">Volver</a
    >

    <canvas id="myChart2" />
</main>

<style>
    h2 {
        text-align: center;
    }
    h4 {
        text-align: center;
    }
</style>