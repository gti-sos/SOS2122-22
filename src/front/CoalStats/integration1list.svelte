<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    let entries = [];

    
    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/apiIntegrada"); 
        if(res.ok){
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    }
</script>



<main>

	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>API: Calidad del Aire en Sevilla</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="info" on:click={function (){
			window.location.href = `https://sos2122-22.herokuapp.com/#/integration1`
		}}>
			Gráfica
		</Button>
	</td>
	<p></p>
{#await entries}
loading
	{:then entries}
	<Table bordered>
		<thead id="titulitos">
			<tr>
				<th>tiempo</th>
				<th>calidad</th>
				
				
               		
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.datetime}</td>
					<td>{entry.aqi}</td>
					
                    
                   

                  				
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>