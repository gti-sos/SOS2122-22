<script>
    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import { Alert } from 'sveltestrap';
   
    let entry = {};
    let updatedCountry;
    let updatedYear;
    let updatedExport;
    let updatedImport;
    let updatedBalance;

    let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";

    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/trade-stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedExport = entry.export;
            updatedImport = entry.import;
            updatedBalance = entry.balance;
        }else{
            errors(res.status,params.country+"/"+params.year);
            pop();
        }
    }
    async function EditEntry(){
        console.log("Updating entry...."+ updatedCountry);
        updatedExport = parseFloat(updatedExport);
		updatedImport = parseFloat(updatedImport);
		updatedBalance = parseFloat(updatedBalance);
        const res = await fetch("/api/v2/trade-stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    export: updatedExport,
                    import: updatedImport,
                    balance: updatedBalance
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
                if(res.ok){
					visibleError = false;
					visibleMsg = true;
					msg = "Entrada modificada con éxito";
				}
				else{
					errors(res.status);
				}
            }); 
    }

    async function errors(code){
        
        let msg;
        if(code == 404){
            msg = "La entrada seleccionada no existe"
        }
        if(code == 400){
            msg = "La petición no está correctamente formulada"
        }
        if(code == 409){
            msg = "El dato introducido ya existe"
        }
        if(code == 401){
            msg = "No autorizado"
        }
        if(code == 405){
            msg = "Método no permitido"
        }
        window.alert(msg)
            return;
    }
</script>

<main>
    <h1>Editar entrada "{params.country}"/"{params.year}"</h1>

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

    {#await entry}
    loading
        {:then entry}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Exportaciones</th>
                    <th>Importaciones</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedExport}"></td>
                    <td><input bind:value="{updatedImport}"></td>
                    <td><input bind:value="{updatedBalance}"></td>
                    <td><Button outline color="primary" on:click="{EditEntry}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    </main>