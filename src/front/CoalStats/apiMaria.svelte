<script>
    import { onMount } from "svelte";
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let stats = [];
    let stats_country_date = [];
    let stats_veh_comm = [];
    let stats_veh_pass = [];
    let stats_veh_annprod = [];
    async function getPEStats() {
        console.log("Fetching stats....");
        const res1 = await fetch(
            "https://sos2122-21.herokuapp.com/api/v1/productions-vehicles/loadinitialdata"
        );
        if (res1.ok) {
            const res = await fetch(
                "https://sos2122-21.herokuapp.com/api/v1/productions-vehicles"
            );
            if (res.ok) {
                const data = await res.json();
                stats = data;
                console.log("Estadísticas recibidas: " + stats.length);
                //inicializamos los arrays para mostrar los datos
                stats.forEach((stat) => {
                    stats_country_date.push(stat.country + "-" + stat.year);
                    stats_veh_comm.push(stat["veh_comm"]);
                    stats_veh_pass.push(stat["veh_pass"]);
                    stats_veh_annprod.push(stat["veh_annprod"]);
                });
                //esperamos para que se carrguen los datos
                await delay(500);
                loadGraph();
            } else {
                console.log("Error cargando los datos");
            }
        }
    }
    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "bar",
            },
            title: {
                text: "Estadísticas de producción de vehículos",
            },
            subtitle: {
                text: "API Integrada 1",
            },
            yAxis: {
                title: {
                    text: "Valor",
                },
            },
            xAxis: {
                title: {
                    text: "País-Año",
                },
                categories: stats_country_date,
            },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
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
            ],
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500,
                        },
                        chartOptions: {
                            legend: {
                                layout: "horizontal",
                                align: "center",
                                verticalAlign: "bottom",
                            },
                        },
                    },
                ],
            },
        });
    }
    onMount(getPEStats);
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
        <div id="container" />
    </figure>
</main>