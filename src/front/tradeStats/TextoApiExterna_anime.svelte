<script>
    import { onMount } from 'svelte';
    import Table from 'sveltestrap/src/Table.svelte';
	import { Alert } from "sveltestrap";


    let Entries = [];

    onMount(getEntries);
	
	async function getEntries(){
        console.log("Fetching Entries....");
        const res = await fetch("/api/v2/apiAnime");
        if(res.ok){
            const data = await res.json();
            Entries = data;
			total = data.length;
			update();
            console.log("Estadísticas recibidas: "+Entries.length);
        }else{
			errors(res.status);
		}
    }

	
</script>



<main>
	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>USO TEXTO API ANIME  </h1>
		</blockquote>
		<p>
		The Top Animes of all time.
		</p>
	</figure>

{#await Entries}
loading
	{:then entries}

	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>Título</th>
				<th>Más Información</th>
				<th>Imagen</th>
			</tr>
		</thead>
		<tbody>

			{#each entries as entry}
				<tr>
					<td>{entry.title}</td>
					<td> <a href={entry.address}>{entry.address} </a></td>
					<td> <img src={entry.image.replace('https://www.anime-planet.com','')}> </td>
				</tr>
			{/each}

		</tbody>
	</Table>

{/await}

</main>