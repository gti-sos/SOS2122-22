<script>
    import * as c3 from "c3";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';



    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats_country_date = [];
    let ages_zero_fifty = ["Menores de 50"];
    let ages_fifty_seventy = ["Entre 50 y 70 años"];
    let ages_seventy = ["Mayores de 70 años"];
    let stats_imports = ['Importaciones'];
    let stats_exports = ['Exportaciones'];
    let stats_balance = ['Balance comercial'];


    async function getData(){
        const loaData = await fetch("/remoteApiLoadRaul");
        const loaData2 = await fetch("/api/v2/trade-stats/loadInitialData");
        if (loaData.ok && loaData2.ok) {
            const res = await fetch("/remoteApiRaul");
            const res2 = await fetch("/api/v2/trade-stats");
            console.log(res);
            if (res.ok && res2.ok) {
                const data = await res.json();
                const data2 = await res2.json();
                console.log("Estadísticas recibidas: " + data.length + data2.length);
                data.forEach((stat) => {
                    stats_country_date.push(stat.country + " " + stat.year);
                    ages_zero_fifty.push(stat["ages_zero_fifty"]);
                    ages_fifty_seventy.push(stat["ages_fifty_seventy"]);
                    ages_seventy.push(stat["ages_seventy"]);             
                });
                data2.forEach((stat) => {
                    stats_country_date.push(stat.country + " " + stat.year);
                    stats_imports.push(stat["import"]);
                    stats_exports.push(stat["export"]);
                    stats_balance.push(stat["balance"]);  
                });
                await delay(1500);
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
            ages_zero_fifty,
            ages_fifty_seventy,
            ages_seventy,
            stats_imports,
            stats_exports,
            stats_balance
        ],
        type:'spline'
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
        <h3 class="title"> Gráfica Librería C3 API Externa SOS Cancerdeaths-Stats </h3>
        <div id="chart"></div>
        <p class="description">
            Grafica de muertes producidad por cancer
        </p>
        <Button id="btn" color="outline-dark" on:click={function (){
            window.location.href = `/#/integrations/`
               }}>Integrations
        </Button>
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