<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    let entries = [];

    
    onMount(getEntries);
    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/apiLol"); 
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
		  <h1>API: Datos Lol MagiFelix5</h1>
		</blockquote>
		
	  </figure>
	  <td align="center">
		<Button color="info" on:click={function (){
			window.location.href = `https://sos2122-22.herokuapp.com/#/apiLol`
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
                <th>nombre Campeon</th>
				<th>% win rate</th>
				<th>partidas Jugadas</th>
				
				
               		
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
                    <td>{entry.champName}</td>
					<td>{entry.winrate}</td>
					<td>{entry.totalGames}</td>
					
                    
                   

                  				
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}

</main>