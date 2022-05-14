<script>

	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';


    let data = [];

//Función para optener mi ip a través de una API   (ACCESO A LA PRIMERA API DISTINTA DE SOS)
    async function getIpClient() {

        try {
            const res = await fetch("https://api.ipify.org?format=json");
            if(res.ok){
                const json = await res.json();
                data = json; 
                console.log("DATOS"+JSON.stringify(json));
            }
        } catch (error) {
            console.error(error);
        }
        load();
    }

    //const ip1 = "217.217.192.58";
    let entries=[];

//Función para obtener datos a partir de mi IP, acceso a la segunda api distinta de sos. 


    async function load(){

        const res = await fetch("https://worldtimeapi.org/api/ip"+data.ip);
        if (res.ok){
            const json = await res.json();
            console.log("datos cargados..."+JSON.stringify(json));
            entries = json;
          
           
           
        }else{
            console.log("Error en la peticion ");

           
        }


    }


    
</script>

<main>


<h1>Información del Dispositivo personal</h1>

{#await entries}
loading
	{:then entries}
    

    <Table bordered responsive>
        <thead>
            <tr>
                <th>Ip</th>
                <th>Fecha</th>
                <th>Día de la semana</th>
                <th>Dia del año</th>
                <th>Zona Horaria</th>

            </tr>
            <td>{entries.client_ip}</td>

            <td>{entries.datetime}</td>

            <td>{entries.day_of_week}</td>

            <td>{entries.day_of_year}</td>
            <td>{entries.timezone}</td>

            



            

            
        </thead>
        <tbody>
            
         
                
        </tbody>
    </Table>

    <p>Todos los datos han sido generados automaticamente mediante el acceso a dos apis diferentes, las primera para la obtención de la direccion IP pública y la segunda api para obtener la informacion a través de la IP</p>

	
	<br>
	<br>
{/await}
</main>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" on:load="{getIpClient}"></script>

</svelte:head>