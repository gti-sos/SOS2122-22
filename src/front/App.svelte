
<script>
	import Router from "svelte-spa-router"
	import Home from "./Home.svelte";
	import Co2StatsTable from './Co2Stats/Co2StatsTable.svelte';
	import editCo2StatsTable from './Co2Stats/editCo2StatsTable.svelte';
	import graph from "./graph.svelte";
	import co2Graph from "./Co2Stats/Co2Graph.svelte";
	import co2Graph2 from "./Co2Stats/Co2Graph2.svelte";
	import registrationConsum from "./Co2Stats/RegistrationConsum.svelte";
	import EnergyConsum from "./Co2Stats/EnergyConsum.svelte";
	import co2Canvas from "./Co2Stats/Co2Canvas.svelte";
	import externalApi1 from "./Co2Stats/ExternalAPI1.svelte";
	import externalApi2 from "./Co2Stats/ExternalAPI2.svelte";
	import externalApi3 from "./Co2Stats/ExternalAPI3.svelte";


	import coalStatsTable from './CoalStats/coalStatsTable.svelte';
	import editcoalStatsTable from './CoalStats/editcoalStatsTable.svelte';
	import tradeStatsTable from './tradeStats/tradeStatsTable.svelte';
	import editTradeStatsTable from './tradeStats/editTradeStatsTable.svelte';
	import info from './info.svelte';
	import Chart from "./CoalStats/chart.svelte";

	const routes ={

		"/" : Home,
		"/co2StatsTable": Co2StatsTable,
		"/co2StatsTable/:country/:year" : editCo2StatsTable,
		"/graph":graph,
		"/co2Graph":co2Graph,
		"/co2Graph2":co2Graph2,
		"/co2Canvas":co2Canvas,
		"/registrationConsum":registrationConsum,
		"/energyConsum":EnergyConsum,
		"/externalApi1":externalApi1,
		"/externalApi2":externalApi2,
		"/externalApi3":externalApi3,


		"/coalStatsTable": coalStatsTable,
		"/coalStatsTable/:country/:year" : editcoalStatsTable,
		"/tradeStatsTable": tradeStatsTable,
		"/tradeStatsTable/:country/:year" : editTradeStatsTable,
		"/info" : info,
		"/coalStatsTable/chart" : Chart
	};

</script>

<main>

	<Router {routes}/>
	<body>
       
</main>

<style>

</style>



