<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let co2_stats = [];
	let newCo2_stat = {
		country : "",
        year : "",
        co2_tot : "",
        co2_kg : "",
        co2_tpc : ""
	};

    onMount(getStats);


    async function getStats(){
        console.log("Fetching c02Stats....");
		//const initialData = await fetch("/api/v1/co2-stats/loadInitialData"); 
        const res = await fetch("/api/v1/co2-stats"); 
        if(res.ok){
            const data = await res.json();
            co2_stats = data;
            console.log("Received contacts: "+co2_stats.length);
        }
    }

	async function LoadStats(){
        console.log("Loading stats....");
        const res = await fetch("/api/v1/co2-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getStats();
				window.alert("Entradas cargadas con éxito");
			});
    }


	async function insertStat(){

		console.log("Inserting new Stat: "+JSON.stringify(newCo2_stat));
		var country = newCo2_stat.coutry;
		var year = newCo2_stat.year;

		const res1 = await fetch("/api/v1/co2-stats");
		for(var c in res1){
			if(c.country == country && c.year == year){
				console.log("ERRRORORORORORORORORO");
				

			};
		}
		

        const res = await fetch("/api/v1/co2-stats",
					{
						method: "POST",
						body: JSON.stringify(newCo2_stat),
						headers: {
							"Content-Type":"application/json"
						}
					}).then(function (res){
						getStats();
					}); 
					
		console.log("Done.");
	}


	async function 	DeleteStats(){
	console.log("Deleting entries....");
    const res = await fetch("/api/v1/co2-stats/",
		{
			method: "DELETE"
		}).then(function (res){
			getStats();
			window.alert("Entradas elimidas con éxito");
		});	
	}


</script>

<main>
    
{#await co2_stats}
loading
	{:then co2_stats}
	
	<Table bordered>
		<thead>
			<tr>
				<Button 
						outline 
						color="primary" 
						on:click="{LoadStats}">
					Cargar Datos Iniciales
					</Button>
				<th>Pais</th>
				<th>Año</th>
				<th>C02 por 1000 Dolares del PIB</th>
				<th>Emisiones totales de C02</th>
                <th>C02 toneladas per capita</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newCo2_stat.country}"></td>
				<td><input bind:value="{newCo2_stat.year}"></td>
				<td><input bind:value="{newCo2_stat.co2_kg}"></td>
                <td><input bind:value="{newCo2_stat.co2_tot}"></td>
				<td><input bind:value="{newCo2_stat.co2_tpc}"></td>

				<td>
					<Button 
						outline 
						color="primary" 
						on:click="{insertStat}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each co2_stats as co2_stat}
				<tr>
					<td><a href="#/Co2StatsTable/{co2_stat.country}">{co2_stat.country}</a></td>
					<td>{co2_stat.year}</td>
					<td>{co2_stat.co2_kg}</td>
                    <td>{co2_stat.co2_tot}</td>
                    <td>{co2_stat.co2_tpc}</td>
				</tr>
				
			{/each}
		</tbody>

	</Table>
	<td>
		<Button 
			outline 
			color="primary" 
			on:click="{DeleteStats}">
		Eliminar Todo 
		</Button>
	</td>
{/await}

</main>