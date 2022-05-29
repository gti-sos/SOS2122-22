<script>
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats_country_date = [];
    let stats_imports = [];
    let stats_exports = [];
    let stats_balance = [];

    async function getData(){
        const loaData = await fetch("/api/v2/trade-stats/loadInitialData");
        if (loaData.ok) {
            const res = await fetch("/api/v2/trade-stats");
            console.log(res);
            if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas: " + data.length);
                data.forEach((stat) => {
                    stats_country_date.push(stat.country + " " + stat.year);
                    stats_imports.push(stat["import"]);
                    stats_exports.push(stat["export"]);
                    stats_balance.push(stat["balance"]);             
                });
                await delay(1000);
                loadGraph();
            } else {
                console.log("Error cargando los datos");
            }
        } else {
                console.log("Error cargando los datos iniciales");
            }
    }

    async function loadGraph(){

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Gráfica Trade-Stats API (M€)'
            },
            xAxis: {
                categories: stats_country_date,
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
                data: stats_exports
                },
                {
                name: 'Balance',
                data: stats_balance
                },]
        });
         
    }

    onMount(getData);

</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description" >
            Gráfica acerca de exportaciones, importaciones y balances comerciales de diferentes paises a lo largo de los últimos años.
        </p>
        <Button id="btn" color="outline-dark" on:click={function (){
            window.location.href = `/#/tradeStatsTable/`
               }}>Trade-stats API
       </Button>
    </figure>


</main>

<style>
    .highcharts-description{
        text-align:center
    }
</style>