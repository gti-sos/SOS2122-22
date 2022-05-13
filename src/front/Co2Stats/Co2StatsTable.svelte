<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	import { Alert } from 'sveltestrap';

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
    let checkMSG = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=6;
    let errorC=0;

    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        //		let cadena = `/remoteAPI?limit=${limit}&&offset=${offset*10}&&`;

		let cadena = `/api/v2/co2-stats?limit=${limit}&&offset=${offset*10}&&`;
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

        }else{
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
	async function insertEntry(){
        console.log("Inserting entry...."+JSON.stringify(newCo2_stat));
        if(newCo2_stat.country=='' ||newCo2_stat.year==""){
            visible = true;
            console.log("Data introduced");
            color = "danger";
            checkMSG="El campo Pais o Año estan vacíos";
        }else{
            const res = await fetch("/api/v2/co2-stats",
			{
				method: "POST",
				body: JSON.stringify(newCo2_stat),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
                        console.log("iosdhfviosdbhfvioubsdfio");
                        if (res.status == 201){
                            getEntries()
                            totaldata++;
                            visible = true;
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
                                                 
                        //setInterval("location.reload()",60000);

                    }); 

        }
        
                    
        console.log("ahoraaa");

    }
	//Función para borrar una entrada
	async function BorrarEntry(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v2/co2-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				
				getEntries();
				//Código de Entrada eliminada con éxito
				if(res.status ==200){
                    visible = true;
                    color="success";
                    checkMSG = "Elemento eliminado correctamente";

                }else{
                    checkMSG = "malll";
                }
			});
    }
	//Función para borrar todas las entradas
	async function BorrarEntries(){
        console.log("Deleting entries....");
        const res = await fetch("/api/v2/co2-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
                if(res.status==200){
                    visible = true;
                    color = "success";
                    checkMSG = "Eliminadas todas las entradas con exito";
                }
				//window.alert("Entradas elimidas con éxito");
			});
    }
	//Función para cargar las entradas
	async function LoadEntries(){
        console.log("Loading entries....");
        //const res = await fetch("/remoteAPI/loadInitialData",

        const res = await fetch("/api/v2/co2-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEntries();
                errorC=200.4;
				//window.alert("Entradas cargadas con éxito");
                if (res.ok) {
                    console.log("Ok:");
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
    
	
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
		{#if checkMSG}
			{checkMSG}
		{/if}
	</Alert>
    
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
                <td><input type="text" required bind:value="{newCo2_stat.country}"></td>
                <td><input type="number" required bind:value="{newCo2_stat.year}"></td>
                <td><input type="number" required bind:value="{newCo2_stat.co2_kg}"></td>
                <td><input type="number" required bind:value="{newCo2_stat.co2_tot}"></td>
                <td><input type="number" required bind:value="{newCo2_stat.co2_tpc}"></td>

                <td><Button outline color="primary" on:click="{insertEntry}">
                    Añadir
                    </Button >
                </td>

            </tr>
            {#each entries as co2_stat}
                <tr>
                    <td><a href="#/co2StatsTable/{co2_stat.country}">{co2_stat.country}</a></td>
                    <td>{co2_stat.year}</td>
                    <td>{co2_stat.co2_kg}</td>
                    <td>{co2_stat.co2_tot}</td>
                    <td>{co2_stat.co2_tpc}</td>
                    <td><Button outline color="warning" on:click={function (){
                        window.location.href = `/#/co2StatsTable/${co2_stat.country}/${co2_stat.year}`
                    }}>
                        Editar
                    </Button>
                    <td>
                    <Button outline color="danger" on:click={BorrarEntry(co2_stat.country,co2_stat.year)}>
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