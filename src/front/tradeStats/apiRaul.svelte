<script>
    import * as c3 from "c3";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';



    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats_country_date = [];
    let ages_zero_fifty = ["Menores de 50"];
    let ages_fifty_seventy = ["Entre 50 y 70 años"];
    let ages_seventy = ["Mayores de 70 años"];


    async function getData(){
        const loaData = await fetch("/remoteApiLoadRaul");
        if (loaData.ok) {
            const res = await fetch("/remoteApiRaul");
            console.log(res);
            if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas: " + data.length);
                data.forEach((stat) => {
                    stats_country_date.push(stat.country + " " + stat.year);
                    ages_zero_fifty.push(stat["ages_zero_fifty"]);
                    ages_fifty_seventy.push(stat["ages_fifty_seventy"]);
                    ages_seventy.push(stat["ages_seventy"]);             
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
            ages_seventy
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
       <Button id="btn" color="outline-dark" on:click={function (){
        window.location.href = `/remoteApiRaul`
           }}>JSON (Proxy)
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