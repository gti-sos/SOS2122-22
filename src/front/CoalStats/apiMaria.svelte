<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let stats = [];
    let xLabel = [];

    let stats_country_date = [];
    let stats_veh_comm = [];
    let stats_veh_pass = [];
    let stats_veh_annprod = [];
    //CoalStats
    let CoalStats = [];
    let productions_stats = [];
    let consumption_stats = [];
    let exports_stats = []; 
    async function getData(){
        await fetch("api/v2/coal-stats/loadinitialdata");
        const res1 = await fetch(
            "https://sos2122-21.herokuapp.com/api/v1/productions-vehicles/loadinitialdata"
        );
        
        const Coalstats = await fetch("api/v2/coal-stats/");
        //proxy
        const res = await fetch(
                "http://sos2122-21.herokuapp.com/api/v1/productions-vehicles"
            );
        if (Coalstats.ok && res.ok){
            
            stats = await res.json();
            CoalStats = await Coalstats.json();
            

            stats.forEach((stat) => {
                    stats_country_date.push(stat.country + "-" + stat.year);
                    stats_veh_comm.push(stat["veh_comm"]);
                    stats_veh_pass.push(stat["veh_pass"]);
                    stats_veh_annprod.push(stat["veh_annprod"]);
                });
      
            CoalStats.forEach(element=>{
                productions_stats.push(parseFloat(element.productions));
                exports_stats.push(parseFloat(element.exports));
                consumption_stats.push(parseFloat(element.consumption));
            });
            
            stats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            CoalStats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            xLabel=new Set(xLabel);
            xLabel=Array.from(xLabel);
           
            await delay(500);
            loadGraph();
        }   
    }
    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Gráficas conjuntas'
            },
            subtitle: {
                text: 'Integracion Vehicles + CoalStats | Tipo: Bar'
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
            xAxis: {
                title: {
                    text: "País-Año",
                },
               // categories: stats_country_date,
               categories: xLabel,
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },            
            series: [
                {
                    name: "Vehículos comerciales",
                    data: stats_veh_comm,
                },
                {
                    name: "Vehículos pasajeros",
                    data: stats_veh_pass,
                },
                {
                    name: "Producción anual de vehículos",
                    data: stats_veh_annprod,
                },
                {
                name: 'Producciones',
                data: productions_stats
                },
                {
                name: 'Exportaciones',
                data: exports_stats,
                },
                {
                name: 'Consumo',
                data: consumption_stats
                },
                //NBA
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
   
    onMount(getData);
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>    
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            
        </p>
    </figure>

    <Button outline color="secondary" href="/#/integrations">Volver</Button>
</main>