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


    //marsaamar1 APi ----------------------------------------------------

    let stats_country_date_trade = [];
    let stats_imports = [];
    let stats_exports_trade = [];
    let stats_balance = [];

    async function getDataTrade(){
        const loaData = await fetch("/api/v2/trade-stats/loadInitialData");
        if (loaData.ok) {
            const res = await fetch("/api/v2/trade-stats");
            console.log(res);
            if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas de TradeStats: " + data.length);
                data.forEach((stat) => {
                    stats_country_date_trade.push(stat.country + " " + stat.year);
                    stats_imports.push(stat["import"]);
                    stats_exports_trade.push(stat["export"]);
                    stats_balance.push(stat["balance"]);             
                });
                loadGraph();
            } else {
                console.log("Error cargando los datos");
            }
        } else {
                console.log("Error cargando los datos iniciales");
            }
    }




    //-----------------------------------------

    let apiData = [];
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function getData(){
        
        const res = await fetch("/api/v2/co2-stats");
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
                    labels: stats_country_date.concat(stats_country_date_trade)
                    
                    
                
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
                    name: 'Importaciones',
                    data: stats_imports
                },
                {
                    name: 'Exportaciones',
                    data: stats_exports_trade
                },
                {
                    name: 'Balance',
                    data: stats_balance
                },
                {
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
    onMount(getCoalStats);
    onMount(getData);
    onMount(getDataTrade);
    
   
</script>
<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Basic line chart showing trends in a dataset. This chart includes the
            <code>series-label</code> module, which adds a label to each line for
            enhanced readability.
        </p>
        <Button id="btn" color="outline-dark" on:click={function (){
            window.location.href = `/#/integrations/`
               }}>Integrations
        </Button>
    </figure>
    

</main>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

</svelte:head>