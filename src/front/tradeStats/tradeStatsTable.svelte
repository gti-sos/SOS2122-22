<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    let entries = [];
	let newEntry = {
		country: "",
		year: "",
		export: "",
        import: "",
        balance: ""
	}
    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/trade-stats"); 
        if(res.ok){
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    }
	async function insertEntry(){
        console.log("Inserting entry...."+JSON.stringify(newEntry));
        const res = await fetch("/api/v1/trade-stats",
			{
				method: "POST",
				body: JSON.stringify(newEntry),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				getEntries();
				window.alert("Entrada introducida con éxito");
			}); 
    }
	async function BorrarEntry(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/trade-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
				window.alert("Entrada eliminada con éxito");
			});
    }
	async function BorrarEntries(){
        console.log("Deleting entries....");
        const res = await fetch("/api/v1/trade-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
				window.alert("Entradas elimidas con éxito");
			});
    }
	async function LoadEntries(){
        console.log("Loading entries....");
        const res = await fetch("/api/v1/trade-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEntries();
				window.alert("Entradas cargadas con éxito");
			});
    }
	
</script>



<main>
	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>Trade-stats API</h1>
		</blockquote>
		<p>
		Datos sobre la exportaciones , importaciones y balances de diferentes paises.
		</p>
	  </figure>

{#await entries}
loading
	{:then entries}
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>País</th>
				<th>Año</th>
				<th>Exportaciones</th>
				<th>Importaciones</th>
                <th>Balance</th>
				<th></th>
				<th> </th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newEntry.country}"></td>
				<td><input bind:value="{newEntry.year}"></td>
				<td><input bind:value="{newEntry.export}"></td>
                <td><input bind:value="{newEntry.import}"></td>
                <td><input bind:value="{newEntry.balance}"></td>
				<td><Button outline color="primary" on:click="{insertEntry}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.country}</td>
					<td>{entry.year}</td>
					<td>{entry.export}</td>
                    <td>{entry.import}</td>
                    <td>{entry.balance}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/coalStatsTable/${entry.country}/${entry.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadEntries}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarEntries}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
{/await}

</main>