

<script>
    import { onMount } from "svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
    import UncontrolledAlert from "sveltestrap/src/UncontrolledAlert.svelte";
   

 




    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let categorias = [];
    let total = [];
    let nrenewable = [];
    let renewable = [];
    let errorC = null;
    let fechas = [];
    let co2_tot = [];
    let co2_tpc = [];
    let co2_kg = [];
    let d =[];
    let result = [];
    async function getData() {
        let res;
        let res1;
        let resP;

        res1 = await fetch("/api/v2/co2-stats/loadInitialData");
        //resP = await fetch("/remoteApiEnergy");

        res = await fetch("https://sos2122-10.herokuapp.com/api/v2/energy-consumptions");
        console.log("aquiiii");
        
        if (res.ok && res1.ok) {
            console.log("en el  ok");

            const json = await res.json();
            const json1 = await res1.json();

            console.log("datossss"+JSON.stringify(json));

            for (let i = 0; i < json.length; i++) {
                categorias.push(json[i].year);
                total.push(json[i].percentages_access_elecetricity);
                nrenewable.push(json[i].non_renewable_energy_consumptions);
                renewable.push(json[i].renewable_energy_consumptions);
            }
            json1.forEach(data => {
                fechas.push(data.year);
                co2_tot.push(data.co2_tot);
                co2_tpc.push(data.co2_tpc);
                co2_kg.push(data.co2_kg);   
            });
            categorias = categorias.sort();
            result = categorias.filter((item,index)=>{
            return categorias.indexOf(item) === index;
            })
            d.push(co2_tot,co2_kg,co2_tpc);
            console.log(fechas);
           
            await delay(1000);
            loadGraph();
        } else {
            errorC = 404;
            total = [];
            nrenewable = [];
            renewable = [];
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
           categorias  
        ,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Rainfall (mm)'
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
            El país introducido no tiene registros.
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
