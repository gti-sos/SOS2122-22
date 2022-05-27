<script>
    import * as c3 from "c3";
    import { onMount } from 'svelte';



    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats_country_date = [];
    let stats_public_expenditure = ["Public expenditure"];
    let stats_PE_on_defence = ["PE to GDP (%)"];
    let stats_PE_to_gdp = ["PE on defence (%)"];


    async function getData(){
        const loaData = await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats/loadInitialData");
        if (loaData.ok) {
            const res = await fetch("https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats");
            console.log(res);
            if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas: " + data.length);
                data.forEach((stat) => {
                    stats_country_date.push(stat.country + " " + stat.year);
                    stats_public_expenditure.push(stat["public_expenditure"]);
                    stats_PE_on_defence.push(stat["pe_to_gdp"]);
                    stats_PE_to_gdp.push(stat["pe_on_defence"]);             
                });
                await delay(1500);
                loadGraph();
            } else {
                console.log("Error cargando los datos");
            }
        } else {
                console.log("Error cargando los datos iniciales");
            }
    }

    async function loadGraph(){
        var chart = c3.generate({

        /*data: {
        
        columns: [
            ['data1', stats_public_expenditure],
            ['data3', stats_PE_to_gdp]
        ],
        type: {
            data1: 'area',
            data3: 'area-spline'
        }
    },
    axis: {
        x: {
            type: 'category',
            categories: stats_country_date
        }
    } */           
            
    data: {
        
        columns: [
            stats_public_expenditure,
            stats_PE_on_defence,
            stats_PE_to_gdp
        ],
        type:'step'
    },
    axis: {
        x: {
            type: 'category',
            categories: stats_country_date
        }
}
});
    }  
    onMount(getData); 
</script>

<svelte:head>

 <link rel="stylesheet" href="./marsaamar1/c3.css">
</svelte:head>

<main>
    <figure>
        <h3 class="title"> Gráfica Librería C3 API Externa SOS Expenditure-stats </h3>
        <div id="chart"></div>
        <p class="description">
           Grafic about public expenditure stats by country and year
        </p>
    </figure>
    

    
</main>

<style>
    .description{
        margin-top: 10pt;
        text-align:center
    }
    .title{
        margin-bottom: 15pt;
        text-align:center
    }
</style>