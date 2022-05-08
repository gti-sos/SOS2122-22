<script>
    import { onMount } from "svelte";
    import Button from 'sveltestrap/src/Button.svelte';

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
        var ctx = document.getElementById("myChart").getContext("2d");
        var trace_consumption = new Chart(ctx, {
            type: "bar",
            data: {
                labels: stats_country_date,
                datasets: [
                    {
                        label: "Producciones",
                        borderColor: "rgba(255, 99, 132, 0.2)",
                        backgroundColor: "rgba(255, 99, 132, 1)",
                        data: stats_productions,
                    },
                    {
                        label: "Exportaciones",
                        backgroundColor: "#bc98f3",
                        borderColor: "#bc98f3",
                        data: stats_exports,
                    },
                    {
                        label: "Consumo",
                        backgroundColor: "#bdecb6",
                        borderColor: "#bdecb6",
                        data: stats_consumption,
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
    <h2>Datos de Carbón</h2>
    <h4>Biblioteca: Chart.js</h4>
    <!--<button class="btn btn-primary hBack" type="button">Volver</button>
    <a href="/#/coal-stats" class="btn btn-primary hBack" role="button" >Volver</a> -->
    <Button color="outline-dark" on:click={function (){
         window.location.href = `/#/coalStatsTable/`
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