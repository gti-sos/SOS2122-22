<script>
    import { onMount } from "svelte";
    import Button from 'sveltestrap/src/Button.svelte';

    
    let myChart;

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let data = [];
    let stats_name = [];
    let stats_win = [];
    let stats_games = [];


	
    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/apiLol");
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_name.push(stat.champName);
                stats_win.push(stat.winrate.replace('%',''));
                stats_games.push(stat.totalGames.replace('games',''));
               
				
            });
            console.log(stats_name,stats_win.map(x=>Number(x)),stats_games.map(x=>Number(x)));
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
                labels: stats_name,
                datasets: [
                    {
                        label: "WIN RATE",
                        borderColor: "rgba(255, 99, 132, 0.2)",
                        backgroundColor: "rgba(255, 99, 132, 1)",
                        data: stats_win,
                    },
                    {
                        label: "Partidas Jugadas",
                        backgroundColor: "#bc98f3",
                        borderColor: "#bc98f3",
                        data: stats_games,
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
    <h2>Datos de uno de los mejores jugadores de Lol (MagiFelix5)<h5>(campeones jugados)</h5></h2>
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