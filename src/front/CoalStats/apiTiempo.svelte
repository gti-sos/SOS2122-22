<script>
    import { onMount } from "svelte";
    import Button from 'sveltestrap/src/Button.svelte';

    
    let myChart;

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let tiempo = [];
    let stats_temp = [];
    let stats_hum = [];
    let stats_feels = [];


	
    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/apiTiempo");
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.results.length);
            data.results.forEach((stat) => {
                tiempo.push(stat.title)
                stats_temp.push(stat.year);
                stats_hum.push(stat.rating.replace('/10',''));
               
				
            });
            
            loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
    }
    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        let myChart;
        if(myChart){
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: tiempo,
                datasets: [
                    {
                        label: "calificacion",
                        backgroundColor: "#bc98f3",
                        borderColor: "#bc98f3",
                        data: stats_hum,
                    },
                    
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            },
        });
       
       
    }
    onMount(getStats);
</script>

<svelte:head>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"
        on:load={loadGraph}></script>
</svelte:head>

<main>
    <h2>Calificaciones Pelis</h2>
     <div></div>
    <h4>Biblioteca: Chart.js</h4>
    <!--<button class="btn btn-primary hBack" type="button">Volver</button>
    <a href="/#/coal-stats" class="btn btn-primary hBack" role="button" >Volver</a> -->
    <Button color="outline-dark" on:click={function (){
         window.location.href = `/#/integrations/`
            }}>Volver
    </Button>
    
    

    <canvas id="myChart" />

</main>

<style>
    h2 {
        text-align: center;
    }
    h4 {
        text-align: center;
    }
</style>