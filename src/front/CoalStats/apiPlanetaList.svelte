<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    let entries = [];

    
    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/apiIntegradaPlaneta"); 
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
		  <h1>API: Distancia a años Luz de estrellas</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="info" on:click={function (){
			window.location.href = `https://sos2122-22.herokuapp.com/#/apiPlaneta`
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
				<th>Nombre Estrella</th>
				<th>Distancia a años luz</th>
				<th>Info</th>

				
				
               		
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.name}</td>
					<td>{entry.distance}</td>
					<td>
					<a href="{entry.link}">{entry.link}</a></td>
					
                    
                   

                  				
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>