<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

    let apiData = [];
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function getData(){
        const res = await fetch("api/v2/co2-stats/loadInitialData");
        if (res.ok){
            const json = await res.json();
            console.log("datos cargados..."+JSON.stringify(json));
            apiData = json;
            guardaD(json);
            console.log("cargando el grafo con los datos nuevos"+apiData);
            //loadGraph();

            await delay(1000);
            loadChart();
           
        }else{
            console.log("Error en la peticion de los datos iniciales para el grafico");
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
        var digimons={};
        const res2Data = await fetch("https://digimon-api.herokuapp.com/api/digimon");
        const extData = await res2Data.json();  
        console.log(extData);
        var clasesDigimons = [];
        extData.forEach((v) => {
            if(v.level in digimons){
                digimons[v.level] += 1;
            }
            else{
                digimons[v.level]= 1;
            }
        });
        for (var key in digimons) {
            clasesDigimons.push([key,digimons[key]]);
        }
        clasesDigimons.sort(function(a, b) {
            return a[1] - b[1];
        });
        Highcharts.chart('container', {
            chart: {
                type: 'pie',
                options3d: {
                enabled: true,
                alpha: 45
            }
            },
        title: {
            text: 'Integracion de los datos de CO2 con los de la api de Digimon'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    softConnector: true
                },
                center: ['50%', '50%'],
                width: '60%'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Digimons',
            data: clasesDigimons
        },{
            name: 'Co2',
            data: tpc
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                inside: true
                            },
                            center: ['50%', '50%'],
                            width: '100%'
                        }
                    }
                }
            }]
        }
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