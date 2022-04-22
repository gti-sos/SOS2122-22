
<script>
	import Router from "svelte-spa-router"
	import Home from "./Home.svelte";
	import Co2StatsTable from './Co2Stats/Co2StatsTable.svelte';
	import editCo2StatsTable from './Co2Stats/editCo2StatsTable.svelte';

	import coalStatsTable from './CoalStats/coalStatsTable.svelte';
	import editcoalStatsTable from './CoalStats/editcoalStatsTable.svelte';
	import tradeStatsTable from './tradeStats/tradeStatsTable.svelte';
	import editTradeStatsTable from './tradeStats/editTradeStatsTable.svelte';

	const routes ={

		"/" : Home,
		"/co2StatsTable": Co2StatsTable,
		"/co2StatsTable/:country/:year" : editCo2StatsTable,
		"/coalStatsTable": coalStatsTable,
		"/coalStatsTable/:country/:year" : editcoalStatsTable,
		"/tradeStatsTable": tradeStatsTable,
		"/tradeStatsTable/:country/:year" : editTradeStatsTable,
		"/info" : Home
	};

</script>

<main>

	<Router {routes}/>
	<body>
       
</main>

<style>

</style>



