<script>
    import { onMount } from 'svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
	import {Pagination, PaginationItem, PaginationLink, Alert } from "sveltestrap";


    let Entries = [];
	let newEntry = {
		country: "",
		year: "",
		export: "",
        import: "",
        balance: ""
	}

	let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";

	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;

	let from = 2017;
	let to = 2022;

    onMount(getEntries);
	
	async function getEntries(){
        console.log("Fetching Entries....");
        const res = await fetch("/api/v2/trade-stats");
        if(res.ok){
            const data = await res.json();
            Entries = data;
			total = data.length;
			update();
            console.log("Estadísticas recibidas: "+Entries.length);
        }else{
			errors(res.status);
		}
    }

	async function insertEntry(){
		console.log("Inserting Entry...."+JSON.stringify(newEntry));
		if(!!newEntry.country && !!newEntry.year){
			newEntry.year = parseInt(newEntry.year);
			newEntry.export = parseFloat(newEntry.export);
			newEntry.balance = parseFloat(newEntry.balance);
			newEntry.import = parseFloat(newEntry.import);
			const res = await fetch("/api/v2/trade-stats",
			{
				method: "POST",
				body: JSON.stringify(newEntry),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				if(res.ok){
					newEntry.country ="";
					newEntry.year = "";
					newEntry.export = "";
					newEntry.import = "";
					newEntry.balance = "";
					getEntries();
					getEntriesPaging();
					visibleError = false;
					visibleMsg = true;
					msg = "Entrada introducida con éxito";
					total+=1;
					printPagingEstate();
				}
				else{
					errors(res.status);
				}
			});
		}else{
			visibleMsg = false;
			visibleError = true;
			errorMsg = "Faltan los campos país y año";
		}
		
	}

	async function BorrarEntry(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v2/trade-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				if(res.ok){
					getEntries();
					visibleError = false;
					visibleMsg = true;
					msg = "Entrada eliminada con éxito";
					total-=1;
					printPagingEstate();
				}
				else{
					errors(res.status);
				}
			});
    }

	async function BorrarEntries(){
        console.log("Deleting entries....");
        const res = await fetch("/api/v2/trade-stats",
			{
				method: "DELETE"
			}).then(function (res){
				if(res.ok){
					getEntries();
					visibleError = false;
					visibleMsg = true;
					msg = "Entradas eliminadas con éxito";
					printPagingEstate();

				}
				else{
					errors(res.status);
				}
			});
    }
	async function LoadEntries(){
        console.log("Loading Entries....");
        const res = await fetch("/api/v2/trade-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				if(res.ok){
					getEntries();
					visibleError = false;
					visibleMsg = true;
					msg = "Entradas cargadas con éxito";
					printPagingEstate();

				}
				else{
					errors(res.status);
				}
			});
    }
	
	async function getEntriesPaging() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/trade-stats"+ "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.ok){
			console.log("getEntriesPaging Ok.");
			const data = await res.json();
			Entries = data;
			console.log("Entradas recibidas: "+Entries.length);
			update();
		}else{
			errors(res.status);
		}
  	}

	async function update() {
      const res = await fetch("/api/v2/trade-stats");
      if (res.status == 200) {
        const json = await res.json();
        total = json.length;
        changePage(c_page, c_offset);
      } 
    }

	function errors(code){
        let error;
		switch (code) {
			case 404:
				error = "La entrada " + newEntry.country + "/" + newEntry.year + " no existe"
				break;
			case 400:
				error = "La petición no está correctamente formulada"
				break;
			case 409:
				error = "El dato introducido ya existe"
				break;
			case 401:
				error = "No autorizado"
				break;
			case 405:
				error = "Método no permitido"
				break;
			default:
				error = "Error desconocido"
		}
		visibleMsg=false;
		visibleError=true;
        errorMsg = error;
        return;
    }

	function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}

	function changePage(page, offset) {
      
      lastPage = Math.ceil(total/limit);
      console.log("Last page = " + lastPage);
      if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getEntries();
		getEntriesPaging();
      }
    }
	
	function printPagingEstate(){
		console.log("----------------------");
		console.log("CPage: ",c_page," || LastPage: ",lastPage," || COffset: ",c_offset," || Total: ",total);
		console.log("----------------------");

	}

	async function getEntriesByYear(){
		console.log("Fetching data from ",from," to ",to," ......");
        const res = await fetch("/api/v2/trade-stats"+"?from="+from+"&to="+to);
        if(res.ok){
            const data = await res.json();
            Entries = data;
			total = data.length;
			update();
            console.log("Entrada recibida: "+ Entries.length);
        }else{
			errors(res.status);
		}
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

	<Alert color="danger" isOpen={visibleError} toggle={() => (visibleError = false)}>
		{#if errorMsg}
			<p>ERROR: {errorMsg}</p>
		   {/if}
	</Alert>
	<Alert color="success" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>
		{#if msg}
			<p>Correcto: {msg}</p>
		{/if}
	</Alert>

{#await Entries}
loading
	{:then entries}

	<Table bordered>
		<tbody>
			<tr>
				<td>Filtrar por años</td>
				<td>desde</td>
                <td><input bind:value="{from}"></td>
				<td>hasta</td>
                <td><input bind:value="{to}"></td>
				<td colspan="2"><Button block outline color="success" on:click={getEntriesByYear}>
					Filtrar
				</Button></td>
			</tr>
		</tbody>
	</Table>

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
						window.location.href = `/#/tradeStatsTable/${entry.country}/${entry.year}`
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

	<div>
		<Pagination ariaLabel="Web pagination">
		  <PaginationItem class = {c_page === 1 ? "disabled" : ""}>
				<PaginationLink previous href="#/tradeStatsTable" on:click={() => changePage(c_page - 1, c_offset - 10)}/>
		  </PaginationItem>
		  {#each range(lastPage, 1) as page}
				<PaginationItem class = {c_page === page ? "active" : ""}>
				  <PaginationLink previous href="#/tradeStatsTable" on:click={() => changePage(page, (page - 1) * 10)}>
					  {page}
				  </PaginationLink>
				</PaginationItem>
		  {/each}
		  <PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
				<PaginationLink next href="#/tradeStatsTable" on:click={() => changePage(c_page + 1, c_offset + 10)}/>
		  </PaginationItem>
		</Pagination>
  </div>

{/await}

</main>