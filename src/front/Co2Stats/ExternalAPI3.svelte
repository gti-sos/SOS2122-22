

<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

    let apiData = [];
    let apiData2 =[];
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function getData(){
       
        const res = await fetch("api/v2/co2-stats");
        const res2 = await fetch("https://api.coincap.io/v2/assets");
        if (res.ok){
            const json = await res.json();
            console.log("datos cargados..."+JSON.stringify(json));
            apiData = json;
            guardaD(json);
            console.log("cargando el grafo con los datos nuevos"+apiData);
            //loadGraph();

            const json2 = await res2.json();
            console.log("DATOS2"+JSON.stringify(json2.data));
            let data = json2.data;
            for (let i=0;i<data.length;i++){
                apiData2.push(parseInt(data[i].priceUsd));

            }
            console.log(apiData2)
            

            await delay(1000);
            loadChart();
           
        }else{
            console.log("Error en la peticion de los datos iniciales para el grafico");

            await delay(1000);
            loadGraph();
        }
    }

    let tpc = [];
    let kg = [];
    let tot = [];
    async function guardaD(json){
        for(let i = 0; i<json.length; i++){
                let aux = [];
                aux.push(json[i].year);
                aux.push(json[i].co2_kg);
                kg.push(aux);

                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].co2_tot);
                tot.push(aux);
                
                aux = [];
                aux.push(json[i].year);
                aux.push(json[i].co2_tpc);
                tpc.push(aux);
            }
    }


    async function loadChart(){
    
        Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Integración de la api del precio del Bitcoin con la propia de Co2'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        
        tickmarkPlacement: 'on',
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: 'price'
        },
        labels: {
            formatter: function () {
                return this.value / 1000;
            }
        }
    },
    tooltip: {
        split: true,
        valueSuffix: ''
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    series: [{
        name: 'Datos del precio del bitcoin',
        data: apiData2
    },{
        name : "Co2 mt ",
        data : kg
    },
    {
        name : "Co2 por tpc",
        data : tpc
    },
    {
        name : "Co2 tot",
        data : tot
    }
]
});
    }
</script>
<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load={getData}></script>
    <script src="https://code.highcharts.com/modules/funnel.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p style="text-align: center;" class="highcharts-description">
            Grafico de tarta que muestra la integracion de dos api's
        </p>
    </figure>
    <Button id="back" outline color="secondary" on:click="{pop}"> Volver</Button>
</main>
<style>
    .highcharts-figure {
    min-width: 320px; 
    max-width: 1000px;
    margin: 1em auto;
}
</style>
