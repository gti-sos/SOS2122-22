<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let coalStats = [];
	let newCoal_stat = {
		country : "",
        year : "",
        productions : "",
        exports : "",
        consumption : ""
	};

    onMount(getStats);

/*	onMount(getInitialStats);
	async function getInitialStats(){
        console.log("Fetching c02Stats....");
        const res = await fetch("/api/v1/co2-stats/loadInitialData"); 
        if(res.ok){
            const data = await res.json();
            co2_stats = data;
            console.log("Received contacts: "+co2_stats.length);
        }
    }
*/
    async function getStats(){
        console.log("Fetching c0alStats....");
		const initialData = await fetch("/api/v1/coal-stats/loadInitialData"); 
		coalStats.push(initialData);
        const res = await fetch("/api/v1/coal-stats"); 
        if(res.ok){
            const data = await res.json();
            coalStats = data;
            console.log("Received stats: "+coalStats.length);
        }
    }


	async function insertStat(){

		console.log("Inserting new Stat: "+JSON.stringify(newCoal_stat));
		var country = newCoal_stat.coutry;
		var year = newCoal_stat.year;

		const res1 = await fetch("/api/v1/coal-stats");
		for(var c in res1){
			if(c.country == country && c.year == year){
				console.log("ERRROR");

			};
		}
		

        const res = await fetch("/api/v1/coal-stats",
					{
						method: "POST",
						body: JSON.stringify(newCoal_stat),
						headers: {
							"Content-Type":"application/json"
						}
					}).then(function (res){
						getStats();
					}); 
					
		console.log("Done.");
	}

</script>

<main>
    
{#await coalStats}
loading
	{:then coalStats}
	

	<Table bordered>
		<thead>
			<tr>
				<th>Country</th>
				<th>Year</th>
				<th>productions</th>
				<th>exports</th>
                <th>consumption</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newCoal_stat.country}"></td>
				<td><input bind:value="{newCoal_stat.year}"></td>
				<td><input bind:value="{newCoal_stat.productions}"></td>
                <td><input bind:value="{newCoal_stat.exports}"></td>
				<td><input bind:value="{newCoal_stat.consumption}"></td>

				<td><Button 
						outline 
						color="primary" 
						on:click="{insertStat}">
					Insert
					</Button>
				</td>
			</tr>
			{#each coalStats as coalStat}
				<tr>
					<td><a href="#/Co2StatsTable/{coalStat.country}">{coalStat.country}</a></td>
					<td>{coalStat.year}</td>
					<td>{coalStat.productions}</td>
                    <td>{coalStat.exports}</td>
                    <td>{coalStat.consumption}</td>
				</tr>
			{/each}
		</tbody>
	</Table>
{/await}

</main>