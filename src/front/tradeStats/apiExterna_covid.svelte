
<script>
    import * as c3 from "c3";
    import { onMount } from 'svelte';



    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let nombres = [];
    let muertes = [];



    async function getData(){
        const res = await fetch("/api/v2/apiCovid");
        if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas: " + data.length);
                data.forEach((stat) => {
                    nombres.push(stat["continent"]);
                    muertes.push(parseInt((stat["totalDeaths"].replace(',','')).replace(',','')));
                });
                console.log( muertes);
                console.log( nombres);
                await delay(1500);
                loadGraph();
        } else {
                console.log("Error cargando los datos iniciales");
            }
    }

    async function loadGraph(){
        var chart = c3.generate({
            
    data: {
        
        columns: [
            [nombres[0], muertes[0]],
            [nombres[1], muertes[1]],
            [nombres[2], muertes[2]],
            [nombres[3], muertes[3]],
            [nombres[4], muertes[4]],
            [nombres[5], muertes[5]],
        ],
        type : 'pie',
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
        <h3 class="title"> Gráfica Librería C3 API EXTERNA 1</h3>
        <div id="chart"></div>
        <p class="description">
            Gráfica acerca del porcentaje total de muertes por Covid19 por continentes.
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