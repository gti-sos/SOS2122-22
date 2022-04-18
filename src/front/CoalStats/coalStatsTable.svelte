<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    let entries = [];
	let newEntry = {
		country: "",
		year: "",
		productions: "",
        exports: "",
        consumption: ""
	}
    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/coal-stats"); 
        if(res.ok){
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    }
	async function insertEntry(){
        console.log("Inserting entry...."+JSON.stringify(newEntry));
		if (newEntry.country == "" || newEntry.year == "" ||
            newEntry.productions == "" || newEntry.exports == "" || newEntry.consumption == "") {
             alert("Los campos no pueden estar vacios");
		}else{
			const res = await fetch("/api/v1/coal-stats",
            {
                method: "POST",
                body: JSON.stringify(newEntry),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (res){
                if (res.status == 201 || res.status == 200){
                     getEntries()
                     console.log("Data introduced");
                     window.alert("Entrada introducida correctamente");
                }else if(res.status == 400){
                     console.log("ERROR Data was not correctly introduced");
                     window.alert("Entrada introducida incorrectamente");
                }else if(res.status == 409){
                     console.log("ERROR There is already a data with that country and year in the da tabase");
                     window.alert("Ya existe dicha entrada");
                }
            }); 
    }
        
    }
	async function BorrarEntry(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/coal-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
				/*window.alert("Entrada eliminada con éxito");*/
			});
    }
	async function BorrarEntries(){
        console.log("Deleting entries....");
        const res = await fetch("/api/v1/coal-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
				/*window.alert("Entradas elimidas con éxito")*/
			});
    }
	async function LoadEntries(){
        console.log("Loading entries....");
        const res = await fetch("/api/v1/coal-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEntries();
				/*window.alert("Entradas cargadas con éxito");*/
			});
    }
	
</script>



<main>
	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>Coal-stats API</h1>
		</blockquote>
		<p>
		Datos sobre la exportación, producción y consumo del carbón en los paises
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
				<th>Producciones</th>
				<th>Exportaciones</th>
                <th>Consumo</th>
				<th></th>
				<th> </th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newEntry.country}"></td>
				<td><input bind:value="{newEntry.year}"></td>
				<td><input bind:value="{newEntry.productions}"></td>
                <td><input bind:value="{newEntry.exports}"></td>
                <td><input bind:value="{newEntry.consumption}"></td>
				<td><Button outline color="primary" on:click="{insertEntry}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.country}</td>
					<td>{entry.year}</td>
					<td>{entry.productions}</td>
                    <td>{entry.exports}</td>
                    <td>{entry.consumption}</td>
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