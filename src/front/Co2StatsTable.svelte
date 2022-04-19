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
				window.alert("Registros cargados");
				console.log("cargados los registros");
			});
    }


	async function insertStat(){

		console.log("Inserting new Stat: "+JSON.stringify(newCo2_stat));
        const res = await fetch("/api/v1/co2-stats",
					{
						method: "POST",
						body: JSON.stringify(newCo2_stat),
						headers: {
							"Content-Type":"application/json"
						}
					}).then(function (res){
						if(res.status == 201){
							getStats();
							window.alert("Añadido nuevo registro");
						}else{
							var m = "";
							if(res.status == 400){
            					m = "Mala petición"
       						}
        					if(res.status == 409){
            					m = "Conflicto (Ya existe ese recurso)"
       	 					}
        					if(res.status == 401){
           						m = "No autorizado"
        					}
        					if(res.status == 405){
            					m = "Método no permitido"
        					}
        					window.alert(m)
						}
					}); 
					
		console.log("Done.");
	}


	async function 	DeleteStats(){
	console.log("Deleting stats....");
    const res = await fetch("/api/v1/co2-stats/",
		{
			method: "DELETE"
		}).then(function (res){
			getStats();
			window.alert("Registros Eliminados ");
		});	
	}

	async function DeleteStat(country, year){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/co2-stats/"+country+"/"+year,
			{
				method: "DELETE"
			}).then(function (res){
				getStats();
				window.alert("Registro Eliminado");
			});
    }



</script>

<main>


    <h1>Consumo de CO2</h1>

{#await co2_stats}	
loading
	{:then stats}
	

	<Table bordered>
		<thead>
			<tr>
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

				<td><Button outline color="primary" on:click="{insertStat}">
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
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/co2-stats/${co2_stat.country}/${co2_stat.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={DeleteStat(co2_stat.country,co2_stat.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadStats}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={DeleteStats}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
{/await}
    

</main>