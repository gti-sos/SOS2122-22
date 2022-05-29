<script>
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let nombres = [];
    let area = [];

    async function getData(){
        const res = await fetch("/api/v2/apiArea");
        if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas: " + data.length);
                data.forEach((stat) => {
                    nombres.push(stat.name["common"]);
                    area.push(parseInt((stat["area"])));
                });
                console.log( area);
                console.log( nombres);
                await delay(1500);
                loadGraph();
        } else {
                console.log("Error cargando los datos");
            }
    }

    async function loadGraph(){
        var dataPlot = [
            {
                x: nombres,
                y: area,
                type: 'bar'
            }
        ];

        Plotly.newPlot('myDiv', dataPlot);

    }

    onMount(getData);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.12.1.min.js'></script>
</svelte:head>

    
<main>
    <figure>
        <h3 class="title"> Gráfica Librería Plotly API EXTERNA 4</h3>
        <div id='myDiv'></div>
        <p class="description">
            Gráfica area en km² paises de Europa
        </p>
        <Button id="btn" color="outline-dark" on:click={function (){
            window.location.href = `/#/integrations/`
               }}>Integrations
        </Button>
       <Button id="btn" color="outline-dark" on:click={function (){
        window.location.href = `/api/v2/apiArea`
           }}>JSON
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