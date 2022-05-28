<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';

    let entries = [];
    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/apiValorant"); 
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
		  <h1>Personajes Juego Valorant</h1>
		</blockquote>
		
	  </figure>
	  
{#await entries}
loading
	{:then entries}
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>Nombre</th>
				<th>Rol</th>
                <th>Descripción</th>
               		
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.title}</td>
					<td>{entry.role}</td>
                    <td>{entry.description}</td>
					
                   

                  				
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>