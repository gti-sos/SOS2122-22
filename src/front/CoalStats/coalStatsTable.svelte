<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import { Alert } from 'sveltestrap';


    const delay = ms => new Promise(res => setTimeout(res, ms));
	var BASE_API_PATH = "/api/v2/coal-stats";
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
    let numPage = 0;
    let totaldata=11;
    
	let yFrom = "";
	let yTo = "";
    let Uyear = "";
    
    
	//Límite máximo de páginas
 
    
    onMount(getEntries);
    //GET
    async function getEntries(parametros="",b=false) {
        
		console.log("Fetching data....");
		const res = await fetch("/api/v2/coal-stats"+parametros);
						
		console.log(res.ok);
		if (res.ok) {
			const data = await res.json();
			entries = data;
			await delay(50);
            
			for(let i=0; i<entries.length ; i++){
				let y = entries[i].year;
				if(y < yFrom){
					yFrom = y;
				}
			}
			console.log("Received data: " + entries.length);
		}
		
		else{
			if(res.status == "400"){
                visible = true;
                color = "danger";
                checkMSG = "Comprueba los parametros de busqueda";
			}
			if(res.status == "405"){
                color = "danger";
                checkMSG = "Método no permitido";
				
			}
			if(res.status == "404"){
                visible = true;
                color = "danger";
                checkMSG = "Elemento no encontrado";
				
			}
			if(res.status == "500"){
                color = "danger";
                checkMSG = "INTERNAL SERVER ERROR";
				
			}
		}
	}
    async function busqueda_año(Uyear){
        
        const res = await fetch("api/v2/coal-stats?year="+Uyear);
        if(res.ok){
            const json = await res.json();
            entries=json;
            console.log("Found "+ entries.length + " countries");
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
            totaldata=11;
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
             const res = await fetch(BASE_API_PATH+"?limit=10",{
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
    async function getPreviewPage() {
        console.log(totaldata);
        if (page-10 > 1) {
            page-=5; 
        } else page = 1
        console.log("Charging page... Listing since: "+page);
        const res = await fetch("/api/v2/coal-stats?limit=10&offset="+(-1+page));
        
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            entries = json;
            console.log("Received "+entries.length+" resources.");
        } else {
            checkMSG= res.status+": "+res.statusText;
            console.log("ERROR!");
        }
        numPage = Math.round(page/10);
    }
    async function getNextPage() {
        console.log(totaldata);
        if (page+10 > totaldata) {
            page = 1
        } else {
            page+=10
        }
        numPage = Math.round(page/10);
        
        console.log("Charging page... Listing since: "+page);
        const res = await fetch("/api/v2/coal-stats?limit=10&offset="+(-1+page));
    
        if (totaldata == 0){
            console.log("ERROR Data was not erased");
            color = "danger";
            checkMSG= "¡No hay datos!";
        }else if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            entries = json;
            console.log("Received " + entries.length + " resources.");
        } else {
            checkMSG= res.status + ": " + res.statusText;
            console.log("ERROR!");
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
    <Table  >
        <thead  >
            <tr class="table-secondary">
                <th>Fecha_Inicio</th>
                <th>Fecha_Fin</th>
                <th></th>
				<th> </th>
            </tr>
        </thead>
        <tbody>
            <tr >
                <td><input bind:value={yFrom} type="number"/></td>
                <td><input bind:value={yTo} type="number"/> </td>
                <td><Button color="dark" on:click={getEntries(`?from=${yFrom}&to=${yTo}`,true)}>Buscar</Button></td>
                <td>
                    <Button color="outline-dark" on:click="{
                        ()=>{yFrom = null; yTo = null; getEntries();}
                    }">Limpiar Busqueda</Button>
                </td>
                
            </tr>
        </tbody>
    </Table>
    
    <!--<p>Buscar registros del año <input bind:value={Uyear} type="text"/> <Button color="info" on:click={busqueda_año(`${Uyear}`,true)}>Buscar</Button> </p>-->
	<Table >
		
		
		<thead id="titulitos">
			<tr class="table-dark" >
				
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
				<td><Button color="dark" on:click="{insertEntry}">
					Añadir
					</Button>
				</td>
                <td>
                    <Button color="outline-dark" on:click="{
                        ()=>{newEntry.country = null; newEntry.year = null; newEntry.productions = null; newEntry.exports = null;newEntry.consumption = null; getEntries();}
                    }">Limpiar</Button>
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
			
		</tbody>
	</Table>
    
   <Button outline color="info" on:click={LoadEntries}>
            Cargar datos
    </Button>
    <Button outline color="danger" on:click={BorrarEntries}>
            Borrar todo
    </Button>
    <Button color="outline-dark" on:click={function (){
        window.location.href = `/#/coalStatsTable/chart`
    }}>Gráfica1
    </Button>
    <Button color="outline-dark" on:click={function (){
        window.location.href = `/#/coalStatsTable/chart2`
    }}>Gráfica2
    </Button>
    <div align="center">
        <Button id ="atrasbtn" on:click="{getPreviewPage}">
            🢀
        </Button>
        <Button id ="siguientebtn" on:click="{getNextPage}">
            🢂
        </Button>
    </div>
    
    <div align="center">
        Página {numPage} 
    </div>
{/await}

</main>