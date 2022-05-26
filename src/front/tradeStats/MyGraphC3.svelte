<script>
    import * as c3 from "c3";
    import { onMount } from 'svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';


    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats_country_date = [];
    let stats_imports = [];
    let stats_exports = [];
    let stats_balance = [];
    //creo 2 let datos para poder ordenado los datos por año

    async function getData(){
        const loaData = await fetch("/api/v2/trade-stats/loadInitialData");
        if (loaData.ok) {
            const res = await fetch("/api/v2/trade-stats");
            console.log(res);
            if (res.ok) {
                const data = await res.json();
                console.log("Estadísticas recibidas: " + data.length);
                data.forEach((stat) => {
                    stats_country_date.push(stat.country + " " + stat.year);
                    stats_imports.push(stat["import"]);
                    stats_exports.push(stat["export"]);
                    stats_balance.push(stat["balance"]);             
                });
                await delay(1000);
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
            
    data: {
        
        columns: [{
                name: 'Importaciones',
                data: stats_imports
                },
            stats_exports,
            stats_balance
        ],
        type:'bar'
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
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
   
 <!-- Load c3.css -->
 <link rel="stylesheet" href="./jscd/c3/c3.css"  >
<script type="text/javascript" src="./jscd/d3/dist/d3.js" ></script>
<script type="text/javascript" src="./jscd/c3/c3.js" on:load="{loadGraph}"></script>




</svelte:head>

<main>
    
    

    <div id="chart"></div>
</main>