<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';
    const delay = ms => new Promise(res => setTimeout(res,ms));
    let xLabel = [];
    //TENNIS
    let TennisStats = [];
    let stats_mostgrandslams = [];
    let stats_mastersfinals = [];
    let stats_olympicgoldmedals = []; 
    //CoalStats
    let CoalStats = [];
    let productions_stats = [];
    let consumption_stats = [];
    let exports_stats = []; 
    async function getData(){
        await fetch("api/v2/coal-stats/loadinitialdata");
        //proxy
        await fetch("/remoteApiTennisLoadInitialData");
        
        const Coalstats = await fetch("api/v2/coal-stats/");
        //proxy
        const tennis2 = await fetch("/remoteApiTennis");
        if (Coalstats.ok && tennis2.ok){
            
            TennisStats = await tennis2.json();
            CoalStats = await Coalstats.json();
            
            //Tennis
            TennisStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            TennisStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            TennisStats.forEach(element=>{
                stats_mostgrandslams.push(parseFloat(element.most_grand_slam));
                stats_mastersfinals.push(parseFloat(element.masters_finals));
                stats_olympicgoldmedals.push(parseFloat(element.olympic_gold_medals));
            });
            //Premier
            CoalStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            CoalStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            CoalStats.forEach(element=>{
                productions_stats.push(parseFloat(element.productions));
                exports_stats.push(parseFloat(element.exports));
                consumption_stats.push(parseFloat(element.consumption));
            });
            
            TennisStats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            CoalStats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            xLabel=new Set(xLabel);
            xLabel=Array.from(xLabel);
            xLabel.sort();
            await delay(500);
            loadGraph();
        }   
    }
    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Gráficas conjuntas'
            },
            subtitle: {
                text: 'Integracion Tennis + CoalStats | Tipo: Area'
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
                //Tennis
                {
                name: 'Grand Slams Ganados',
                data: stats_mostgrandslams
                },
                {
                name: 'Medallas Olimpicas',
                data: stats_olympicgoldmedals
                },
                {
                name: 'Finales de masters',
                data: stats_mastersfinals
                },
                //PremierLeauge
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

    <Button outline color="secondary" href="/">Volver</Button>
</main>