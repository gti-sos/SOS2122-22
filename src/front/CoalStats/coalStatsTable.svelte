<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import { Alert } from 'sveltestrap';

	var BASE_API_PATH = "/api/v1/coal-stats";
    let entries = [];
	let newEntry = {
		country: "",
		year: "",
		productions: "",
        exports: "",
        consumption: ""
	}

	let checkMSG = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=6;
 
    
    onMount(getEntries);
    //GET
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/coal-stats"); 
        if(res.ok){
            console.log("Ok:");
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }else {
                checkMSG= res.status + ": Recursos no encontrados ";
                console.log("ERROR! no encontrado");
            }
    }
    //GET INITIALDATA
    async function LoadEntries() {
 
        console.log("Fetching entry data...");
        await fetch(BASE_API_PATH + "/loadInitialData");
        const res = await fetch(BASE_API_PATH + "?limit=10&offset=0");
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            entries = json;
            visible = true;
            totaldata=6;
            console.log("Received " + entries.length + " entry data.");
            color = "success";
            checkMSG = "Datos cargados correctamente";
        } else {
            color = "danger";
            checkMSG= res.status + ": " + "No se pudo cargar los datos";
            console.log("ERROR! ");
        }
    }
    //INSERT DATA
    async function insertEntry(){
		 
         console.log("Inserting resources...");
         if (newEntry.country == "" || newEntry.year == null ||
            newEntry.productions == null || newEntry.exports == null || newEntry.consumption == null ) {
             alert("Los campos no pueden estar vacios");
         } else{
             const res = await fetch(BASE_API_PATH,{
                 method:"POST",
                 body:JSON.stringify({
                        country: newEntry.country,
                        year: parseInt(newEntry.year),
                        productions: parseFloat(newEntry.productions),
                        exports: parseFloat(newEntry.exports),
                        consumption: parseFloat(newEntry.consumption) 
                    }),
                 headers:{
                     "Content-Type": "application/json"
                }
            }).then(function (res) {
                 visible=true;
                if (res.status == 201){
                     getEntries()
                     totaldata++;
                     console.log("Data introduced");
                     color = "success";
                     checkMSG="Entrada introducida correctamente a la base de datos";
                }else if(res.status == 400){
                     console.log("ERROR Data was not correctly introduced");
                     color = "danger";
                     checkMSG= "Los datos de la entrada no fueron introducidos correctamente";
                }else if(res.status == 409){
                     console.log("ERROR There is already a data with that country and year in the da tabase");
                     color = "danger";
                     checkMSG= "Ya existe una entrada en la base de datos con el pais y el año introducido";
                }
            });	
        }
    }
    //DELETE STAT
    async function BorrarEntry(countryD, yearD) {
        
        const res = await fetch(BASE_API_PATH+ "/" + countryD + "/" + yearD, {
            method: "DELETE"
        }).then(function (res) {
            visible = true;
            getEntries();      
            if (res.status==200) {
                totaldata--;
                color = "success";
                checkMSG = "Recurso "+countryD+" "+yearD+ " borrado correctamente";
                console.log("Deleted " + countryD);            
            } else if (res.status==404) {
                color = "danger";
                checkMSG = "No se ha encontrado el objeto " + countryD;
                console.log("Resource NOT FOUND");            
            } else {
                color = "danger";
                checkMSG= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
            }      
        });
    }
    //DELETE ALL STATS
    async function BorrarEntries() {
		console.log("Deleting entry data...");
		if (confirm("¿Está seguro de que desea eliminar todas las entradas?")){
			console.log("Deleting all entry data...");
			const res = await fetch(BASE_API_PATH, {
				method: "DELETE"
			}).then(function (res) {
                visible=true;
				if (res.ok && totaldata>0){
                    totaldata = 0;
					getEntries();
                    color = "success";
					checkMSG="Datos eliminados correctamente";
					console.log("OK All data erased");
				} else if (totaldata == 0){
                    console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "¡No hay datos para borrar!";
                } else{
					console.log("ERROR Data was not erased");
                    color = "danger";
					checkMSG= "No se han podido eliminar los datos";
				}
			});
		}
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
	
	<Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
		{#if checkMSG}
			{checkMSG}
		{/if}
	</Alert>

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