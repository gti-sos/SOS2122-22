<script>

    import {onMount} from'svelte';
    import {Button} from 'sveltestrap';

    //Belrodsal APi ----------------------------------------------------

    let data = [];
    let stats_country_date = [];
    let stats_productions = [];
    let stats_exports = [];
    let stats_consumption = [];

    async function getCoalStats() {
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/coal-stats");
        if (res.ok) {
            const data = await res.json();
            console.log("Estadísticas recibidas: " + data.length);
            data.forEach((stat) => {
                stats_country_date.push(stat.country + "-" + stat.year);
                stats_productions.push(stat["productions"]);
                stats_exports.push(stat["exports"]);
                stats_consumption.push(stat["consumption"]);             
            });
            //loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
    }

    //GET INITIALDATA
    async function LoadEntries() {
 
 console.log("Fetching entry data...");
 await fetch(BASE_API_PATH + "/loadInitialData");
 const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");
 if (res.ok) {
     console.log("Ok:");
     const json = await res.json();
     entries = json;
     visible = true;
     totaldata=11;
     console.log("Received " + entries.length + " entry data.");
     color = "success";
     checkMSG = "Datos cargados correctamente";
 } else {
     color = "danger";
     checkMSG= res.status + ": " + "No se pudo cargar los datos";
     console.log("ERROR! ");
 }
}

    //-----------------------------------------

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

            chart:{
                type:'line'
            },

            title: {
                text: 'Grafico del equipo 22'
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
                    },
                    labels: stats_country_date
                    
                
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
                },
                {
                    name: 'Carbon Producciones en mil toneladas',
                    data: stats_productions
                },
                {
                    name: 'Carbon Exportaciones en mil toneladas',
                    data: stats_exports
                },
                {
                    name:'Carbon Consumo en mil toneladas',
                    data:stats_consumption
                }
            
            ],

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
    onMount(getData,getCoalStats);
    //onMount(getCoalStats);
   
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
    <Button outline color="secondary" href="/">Volver</Button>

</main>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>