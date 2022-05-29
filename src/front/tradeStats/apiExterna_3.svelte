<script>
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';


    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let nombres = [];
    let precios = [];

    async function getData(){
        const res = await fetch("/api/v2/apiAcciones");
        if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas: " + data.length);
                data.forEach((stat) => {
                    nombres.push(stat["identifier"]);
                    precios.push(parseInt((stat["lastPrice"])));
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
        var dataPlot = [
            {
                x: nombres,
                y: precios,
                type: 'column'
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
        <h3 class="title"> Gráfica Librería Plotly API EXTERNA 3</h3>
        <div id='myDiv'></div>
        <p class="description">
            Último precio de las acciones de NSE
        </p>
        <Button id="btn" color="outline-dark" on:click={function (){
            window.location.href = `/#/integrations/`
               }}>Integrations
        </Button>
       <Button id="btn" color="outline-dark" on:click={function (){
        window.location.href = `/api/v2/apiAcciones`
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