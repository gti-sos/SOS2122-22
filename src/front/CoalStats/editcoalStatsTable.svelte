<script>
    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';
    import { Alert } from 'sveltestrap';

    let visible = false;
    let color = "danger";


    let entry = {};
    let updatedCountry;
    let updatedYear;
    let updatedproductions;
    let updatedexports;
    let updatedconsumption;
    let errorMsg = "";

    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/coal-stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            entry = data;
            updatedCountry = entry.country;
            updatedYear = entry.year;
            updatedproductions = entry.productions;
            updatedexports = entry.exports;
            updatedconsumption = entry.consumption;
        }else{
            visible = true;
            color = "danger"
            errorMsg = "Error " + res.status + " : " + "Ningún recurso con los parametros " + params.country +" " + params.year;
            console.log("ERROR" + errorMsg);
        }
    }
    async function EditEntry(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v2/coal-stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: parseInt(updatedYear),
                    productions: parseFloat(updatedproductions),
                    exports: parseFloat(updatedexports),
                    consumption: parseFloat(updatedconsumption)
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res) {
                    visible = true;
                    if(res.status == 200){
                        getEntries(); 
                        console.log("Data introduced");
                        color = "success";
                        errorMsg="Recurso actualizado correctamente";
                    }else{
                        console.log("Data not edited");
                        color = "danger";
                        errorMsg= "Compruebe los campos";
                    }
                });	
    }
</script>

<main>
    <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if errorMsg}
		    {errorMsg}
	    {/if}
    </Alert>

    <h1>Editar entrada "{params.country}","{params.year}"</h1>
    {#await entry}
    loading
        {:then entry}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>Producciones</th>
                    <th>Exportaciones</th>
                    <th>Consumo</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input bind:value="{updatedCountry}"></td>
                    <td><input bind:value = "{updatedYear}"></td>
                    <td><input bind:value="{updatedproductions}"></td>
                    <td><input bind:value="{updatedexports}"></td>
                    <td><input bind:value="{updatedconsumption}"></td>
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