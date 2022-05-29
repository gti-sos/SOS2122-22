
<script>
    import * as c3 from "c3";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';



    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let nombres = [];
    let precios = [];

    async function getData(){
        const res = await fetch("/api/v2/apiCriptos");
        if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas: " + data.length);
                data.forEach((stat) => {
                    nombres.push(stat["CoinName"]);
                    precios.push(parseInt((stat["Price"].replace(',','')).replace('$','')));
                });
                console.log( precios);
                console.log( nombres);
                await delay(1500);
                loadGraph();
        } else {
                console.log("Error cargando los datos");
            }
    }


    async function loadGraph(){
        var chart = c3.generate({
            
    data: {
        
        columns: [
            [nombres[0], precios[0]],
            [nombres[1], precios[1]],
            [nombres[2], precios[2]],
            [nombres[3], precios[3]],
            [nombres[4], precios[4]],
            [nombres[5], precios[5]],
        ],
        type : 'donut',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },

});
    }  
    onMount(getData); 
</script>

<svelte:head>

 <link rel="stylesheet" href="./marsaamar1/c3.css">
</svelte:head>

<main>
    <figure>
        <h3 class="title"> Gráfica Librería C3 API EXTERNA 2</h3>
        <div id="chart"></div>
        <p class="description">
            Gráfica acerca del porcentaje de los precios de algunas criptomonedas conocidas.
        </p>
    </figure>
    <Button id="btn" color="outline-dark" on:click={function (){
        window.location.href = `/#/integrations/`
           }}>Integrations
    </Button>
   <Button id="btn" color="outline-dark" on:click={function (){
    window.location.href = `/api/v2/apiCriptos`
       }}>JSON
    </Button>
    

    
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