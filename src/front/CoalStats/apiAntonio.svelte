<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats = [];
    let stats_country_date = [];
    let most_grand_slam = [];
    let masters_finals = [];
    let olympic_gold_medals = [];

    
    async function getStats() {
        console.log("Fetching stats....");
        const res1 = await fetch(
            "https://sos2122-23.herokuapp.com/api/v2/tennis/loadinitialdata"
        );
        if (res1.ok) {
            const res = await fetch(
                "https://sos2122-27.herokuapp.com/api/v2/tennis"
            );
            if (res.ok) {
                const data = await res.json();
                stats = data;
                console.log("Estadísticas recibidas: " + stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach((stat) => {
                    stats_country_date.push(stat.country + "-" + stat.year);
                    most_grand_slam.push(stat["most_grand_slam"]);
                    masters_finals.push(stat["masters_finals"]);
                    olympic_gold_medals.push(stat["olympic_gold_medals"]);
                });
                //esperamos para que se carrguen los datos
                await delay(500);
                loadGraph();
            } else {
                console.log("Error cargando los datos");
            }
        }
    }
    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        var trace_olympic_gold_medals = new Chart(ctx, {
            type: "bar",
            data: {
                labels: stats_country_date,
                datasets: [
                    {
                        label: "Grandslams ganados",
                        backgroundColor: "rgb(0, 128, 128)",
                        borderColor: "rgb(255, 255, 255)",
                        data: most_grand_slam,
                    },
                    {
                        label: "Masters ganados",
                        backgroundColor: "rgb(255, 0 ,0)",
                        borderColor: "rgb(255, 255, 255)",
                        data: masters_finals,
                    },
                    {
                        label: "Medallas olimpicas",
                        backgroundColor: "rgb(255, 255, 0)",
                        borderColor: "rgb(255, 255, 255)",
                        data: olympic_gold_medals,
                    },
                ],
            },
            options: {},
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
    <h2>Más torneos ganados</h2>
    <h4>Biblioteca: Chart.js</h4>
    <!--<button class="btn btn-primary hBack" type="button">Volver</button>
    <a href="/#/tennis" class="btn btn-primary hBack" role="button" >Volver</a> -->
    <a href="/#/integrations" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Volver</a>

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