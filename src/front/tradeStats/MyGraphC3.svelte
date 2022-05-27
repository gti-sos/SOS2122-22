<script>
    import * as c3 from "c3";
    import { onMount } from 'svelte';



    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats_country_date = [];
    let stats_imports = ['Importaciones'];
    let stats_exports = ['Exportaciones'];
    let stats_balance = ['Balance comercial'];


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
        var chart = c3.generate({
            
    data: {
        
        columns: [
            stats_imports,
            stats_exports,
            stats_balance
        ],
        type:'bar'
    },
    bar: {
        width: {
            ratio: 0.5 
        }
    },
    axis: {
        x: {
            type: 'category',
            categories: stats_country_date
        }
}
});
    }  
    onMount(getData); 
</script>

<svelte:head>

 <link rel="stylesheet" href="./marsaamar1/c3.css">
</svelte:head>

<main>
    <figure>
        <h3 class="title"> Gráfica Librería C3 Trade-Stats API (M€) </h3>
        <div id="chart"></div>
        <p class="description">
            Gráfica acerca de exportaciones, importaciones y balances comerciales de diferentes paises a lo largo de los últimos años.
        </p>
    </figure>
    

    
</main>

<style>
    .description{
        margin-top: 10pt;
        text-align:center
    }
    .title{
        margin-bottom: 15pt;
        text-align:center
    }
</style>