
<script>
	import Router from "svelte-spa-router"
	import Home from "./Home.svelte";
	import ContactsTable from './Co2StatsTable.svelte';

	const routes ={

		"/" : Home,
		"/co2StatsTable": ContactsTable,
	};

</script>

<main>

	<Router {routes}/>
	<body>
       
</main>

<style>
	
</style>



