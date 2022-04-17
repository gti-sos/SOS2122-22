
<script>
	import Router from "svelte-spa-router"
	import Home from "./Home.svelte";
	import ContactsTable from './Co2StatsTable.svelte';
	import coalStatsTable from './CoalStats/coalStatsTable.svelte';
	import editcoalStatsTable from './CoalStats/editcoalStatsTable.svelte';

	const routes ={

		"/" : Home,
		"/co2StatsTable": ContactsTable,
		"/coalStatsTable": coalStatsTable,
		"/coalStatsTable/:country/:year" : editcoalStatsTable
	};

</script>

<main>

	<Router {routes}/>
	<body>
       
</main>

<style>
	
</style>



