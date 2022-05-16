

<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

    let apiData = [];
    let apiData2 =[];
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function getData(){
       
        const res = await fetch("api/v2/co2-stats/loadInitialData");
        const res2 = await fetch("https://apiv3.apifootball.com/?action=get_standings&league_id=302&APIkey=238fa8f2f748e83ca2569474a8f848897110a90bb6837bd17d6cdc66a02eb14a");
        if (res.ok){
            const json = await res.json();
            console.log("datos cargados..."+JSON.stringify(json));
            apiData = json;
            guardaD(json);
            console.log("cargando el grafo con los datos nuevos"+apiData);
            //loadGraph();

            const json2 = await res2.json();
            console.log("DATOS2"+JSON.stringify(json2[0].home_league_PTS));
            apiData2 = parseInt(json2[0].home_league_PTS);

            

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
                type: 'pie',
               
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
            data: apiData2
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
