<script>
    
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let total = [];
    let nrenewable = [];
    let renewable = [];
    let errorC = null;
    let fechas = [];
    let co2_tot = [];
    let co2_tpc = [];
    let co2_kg = [];
    let d =[];
    let unicos=[];
    async function getData() {
        let res1;
        let resP;

        res1 = await fetch("/api/v2/co2-stats/loadInitialData");
        resP = await fetch("/remoteApiEnergy");

        //res = await fetch("https://sos2122-10.herokuapp.com/api/v2/energy-consumptions");
        console.log("aquiiii");
        
        if (resP.ok && res1.ok) {
            console.log("en el  ok");

            const json = await res1.json();
            const json1 = await resP.json();

            console.log("datossss"+JSON.stringify(json1));
            json1.forEach(data => {
                fechas.push(data.year);
                total.push(data.percentages_access_elecetricity);
                nrenewable.push(data.non_renewable_energy_consumptions);
                renewable.push(data.renewable_energy_consumptions);   
            });
            json.forEach(data => {
                fechas.push(data.year);
                co2_tot.push(data.co2_tot);
                co2_tpc.push(data.co2_tpc);
                co2_kg.push(data.co2_kg);   
            });
            
            d.push(co2_tot,co2_kg,co2_tpc);
            fechas = fechas.filter((valor, indice) => {
                return fechas.indexOf(valor) === indice;
            });

            //o se come algunos años o muestra años por duplicado, podemos mostrarlo como queramos. 
            

            console.log("eooooo" +unicos);
            await delay(1000);
            loadGraph();
        } else {
            errorC = 404;
            await delay(1000);
            loadGraph();
        }
    }
    async function loadGraph() {
       // Give the points a 3D feel by adding a radial gradient
       Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Integracion de los datos de la api de Consumo de Energía y la api de Co2'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: 
           fechas  
        ,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Co2 total',
        data: co2_tot

    }, {
        name: 'Energia no renovable',
        data: nrenewable

    }
    , {
        name: 'Energia renovable',
        data: renewable

    }
    , {
        name: 'Co2 por kg',
        data: co2_kg

    }]
});
    }

</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js" on:load="{getData}"></script>

</svelte:head>

<main>
    {#if errorC === 404}
        <UncontrolledAlert color="danger">
                Error
        </UncontrolledAlert>
    {/if}
    <br />
    <h1 align="center">Integracion de los datos de consumo de energia con los de Co2 </h1>
  
        
    <br />
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            
        </p>
    </figure>
</main>
