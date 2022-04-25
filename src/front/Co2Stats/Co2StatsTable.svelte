<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];
	let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;
	let maxPages = 0;
    let newCo2_stat = {
        country : "",
        year : "",
        co2_tot : "",
        co2_kg : "",
        co2_tpc : ""
    }
    let errorMsg = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=6;


    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
		let cadena = `/api/v1/co2-stats?limit=${limit}&&offset=${offset*10}&&`;
		if (from != null) {
			cadena = cadena + `from=${from}&&`
		}
		if (to != null) {
			cadena = cadena + `to=${to}&&`
		}
		console.log(cadena);
        const res = await fetch(cadena); 
        if(res.ok){
			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset*10}`);
			maxPagesFunction(cadenaPag[0]+cadenaPag[1]);
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }else{
			Errores(res.status);
		}
    }
	async function insertEntry(){
        console.log("Inserting entry...."+JSON.stringify(newCo2_stat));
        const res = await fetch("/api/v1/co2-stats",
			{
				method: "POST",
				body: JSON.stringify(newCo2_stat),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
                        console.log("iosdhfviosdbhfvioubsdfio");
                        Errores(res.status);
                    }); 
    }
	//Función para borrar una entrada
	async function BorrarEntry(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/co2-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
				window.alert("Entrada eliminada con éxito");
			});
    }
	//Función para borrar todas las entradas
	async function BorrarEntries(){
        console.log("Deleting entries....");
        const res = await fetch("/api/v1/co2-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
				window.alert("Entradas elimidas con éxito");
			});
    }
	//Función para cargar las entradas
	async function LoadEntries(){
        console.log("Loading entries....");
        const res = await fetch("/api/v1/co2-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEntries();
				window.alert("Entradas cargadas con éxito");
			});
    }
	//Función auxiliar para imprimir errores
	async function Errores(code){
        
        let msg;
        if(code == 400){
            msg = "La fecha inicio no puede ser menor a la fecha fin"
        }
		else if(code == 404){
            msg = "No se han encontrado registros en ese rango"
        }
        else if(code == 409){
            msg = "El recurso creado ya existe o hay un conflicto.";
        }
        else{
            msg = "todo ok";
        }
        window.alert(msg)
            return;
    }
	
	//Función auxiliar para obtener el número máximo de páginas que se pueden ver
	async function maxPagesFunction(cadena){
		let num;
        const res = await fetch(cadena,
			{
				method: "GET"
			});
			if(res.ok){
				const data = await res.json();
				maxPages = Math.floor(data.length/10);
				if(maxPages === data.length/10){
					maxPages = maxPages-1;
				}
        }
	}
</script>

<main>
   
    <h1>Consumo de CO2</h1>

{#await entries}
loading
	{:then entries}
    
	<Table bordered>
		<thead>
            <p>Busqueda</p>
            <tr>
                <th>Año Inicial</th>
                <th>Año Final</th>
                
            </tr>
		</thead>
		<tbody>
			<tr>
				<td><input type="number" min="2000" bind:value="{from}"></td>
				<td><input type="number" min="2000" bind:value="{to}"></td>
				<td align="center"><Button outline color="dark" on:click="{()=>{
					if (from == null || to == null) {
						window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')
					}else{
						getEntries();
					}
				}}">
					Buscar
					</Button>
				</td>
				<td align="center"><Button outline color="info" on:click="{()=>{
					from = null;
					to = null;
					getEntries();
					
				}}">
					Limpiar Búsqueda
					</Button>
				</td>
			</tr>
		</tbody>
	</Table>
    <Table bordered responsive>
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

                <td><Button outline color="primary" on:click="{insertEntry}">
                    Añadir
                    </Button>
                </td>

            </tr>
            {#each entries as co2_stat}
                <tr>
                    <td><a href="#/Co2StatsTable/{co2_stat.country}">{co2_stat.country}</a></td>
                    <td>{co2_stat.year}</td>
                    <td>{co2_stat.co2_kg}</td>
                    <td>{co2_stat.co2_tot}</td>
                    <td>{co2_stat.co2_tpc}</td>
                    <td><Button outline color="warning" on:click={function (){
                        window.location.href = `/#/co2StatsTable/${co2_stat.country}/${co2_stat.year}`
                    }}>
                        Editar
                    </Button>
                    <td><Button outline color="danger" on:click={BorrarEntry(co2_stat.country,co2_stat.year)}>
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

	<div align="center">
		{#each Array(maxPages+1) as _,page}
		
			<Button outline color="secondary" on:click={()=>{
				offset = page;
				getEntries();
			}}>{page} </Button>&nbsp
	
		{/each}
		</div>
	
	<br>
	<br>
{/await}

</main>