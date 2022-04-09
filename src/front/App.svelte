
<script>
	import Router from "svelte-spa-router"
	import Home from "./Home.svelte";
	import ContactsTable from './Co2StatsTable.svelte';
	import coalStatsTable from './coalStatsTable.svelte';

	const routes ={

		"/" : Home,
		"/co2StatsTable": ContactsTable,
		"/coalStatsTable": coalStatsTable,
	};

</script>

<main>

	<Router {routes}/>
	<body>
       
</main>

<style>
	
</style>



