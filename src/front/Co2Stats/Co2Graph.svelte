<script>

    import {onMount} from'svelte';
  
    let apiData = [];
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function getData(){
        const res1 = await fetch("api/v2/co2-stats/loadInitialData");
        const res = await fetch("api/v2/co2-stats");

        if (res1.ok&&res.ok){
            const json = await res.json();
            console.log("datos cargados..."+JSON.stringify(json));
            apiData = json;
            guardaD(json);
            console.log("cargando el grafo con los datos nuevos"+apiData);
            await delay(1000);
            loadGraph();
           
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


    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Datos de CO2'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
            },
            xAxis: {
                accessibility: {
                    title :{
                        text:'año'
                    }
                
                }
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2010
                }
            },
            yAxis: {
                title: {
                    text: 'Values'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' units'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'Co2 por tpc',
                data: tpc
            }, {
                name: 'Co2 por kg ',
                data: kg
            },
            {
                 name: 'Total Co2',
                data: tot
            }]
        });
        


    }
    onMount(getData);



   

   
</script>
<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Using an area-splitline graph.
            
        </p>
    </figure>

</main>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
   

</svelte:head>