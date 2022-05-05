<script>

    import {onMount} from'svelte';

    let apiData = [];
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function getData(){
        const res = await fetch("/api/v2/co2-stats/loadInitialData");
        if (res.ok){
            const json = await res.json();
            console.log("lsdknfipndv"+JSON.stringify(json));
            apiData = json;
            guardaD(json);
            console.log("cargando el grafo con los datos nuevos"+apiData);
            //loadGraph();

            await delay(1000);
            loadGraph();
           
        }else{
            console.log("Error in request");

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

            title: {
                text: 'Grafico de Co2, por Jesús Vena Campos'
            },

            subtitle: {
                text: ''
            },

            yAxis: {
                title: {
                    text: 'valor'
                }
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

            series: [{
                
                    name: 'Co2 por Tpc',
                    data: tpc
                },
                {
                    name: 'Co2 Total',
                    data: tot
                },
                {
                    name: 'Co2 por Kg',
                    data: kg
                },],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });


    }
    onMount(getData);
   
</script>
<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Basic line chart showing trends in a dataset. This chart includes the
            <code>series-label</code> module, which adds a label to each line for
            enhanced readability.
        </p>
    </figure>

</main>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>