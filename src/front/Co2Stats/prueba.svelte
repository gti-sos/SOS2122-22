<script>
    import { onMount } from "svelte";

    import {
        Nav,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        NavItem,
        NavLink,
        Button,
        Table,
        UncontrolledAlert,
        Pagination,
        PaginationItem,
        PaginationLink,
        Alert,
    } from "sveltestrap";



    let co2_stats = [];
	let newCo2_stat = {
		country : "",
        year : "",
        co2_tot : "",
        co2_kg : "",
        co2_tpc : ""
	};
    //Load
    let open1 = false;
    const toggle1 = () => (open1 = !open1);
    const toggle1P = () => {
        open1 = !open1;
        loadData();
    };
    //Delete
    let open2 = false;
    const toggle2 = () => (open2 = !open2);
    const toggle2P = () => {
        open2 = !open2;
        deleteData();
    };
    //Alerts
    let visible = true;

    let evictionsData = [];
    let newEviction = {
        location: "",
        year: "",
        total: "",
        rustic: "",
        household: "",
        buildinglot: "",
        other: "",
    };
    let error = null;

    //Pagination
    let current_offset = 0;
    let limit = 10;
    let current_page = 1;
    let last_page = 1;
    let total = 0;

    let visitado = "no";
    let alertError = "";
    let alertOk = "";
    let fullQuery = "";
    var queryT = "";
    let evictionsDataTocho = [];

    async function loadData() {
        console.log("Loading data...");
        alertOk = "";
        alertError = "";
        const res = await fetch("api/v1/evictions/loadInitialData").then(
            function (res) {
                if (res.ok) {
                    console.log("Ok");
                    getData();
                    getNumData();
                    error = 0;
                } else if (res.status == 409) {
                    error = 409;
                    console.log("Conflict");
                } else {
                    error = 404;
                    console.log("Error");
                }
            }
        );
    }

    async function getData() {
        console.log("Fetching data...");
        const res = await fetch(
            "api/v1/evictions?limit=" + limit + "&offset=" + current_offset
        );
        if (res.ok) {
            console.log("Ok");
            const json = await res.json();
            evictionsData = json;
            console.log(`We have received ${evictionsData.length} resources.`);
        } else {
            console.log("Error");
        }
    }

    async function getDataSearch(query) {
        console.log("Fetching data...");
        const res = await fetch(
            "api/v1/evictions" +
                query +
                "&limit=" +
                limit +
                "&offset=" +
                current_offset
        );
        if (res.ok) {
            console.log("Ok");
            const json = await res.json();
            evictionsData = json;
            console.log(`We have received ${evictionsData.length} resources.`);
        } else {
            console.log("Error");
        }
        //getNumDataSearch(query);
    }

    async function getNumDataSearch(query) {
        botonCancelar();
        console.log(
            "LA QUERY: " +
                query +
                "LIMITE: " +
                limit +
                "OFFSET: " +
                current_offset
        );
        //const res = await fetch("api/v1/evictions" + query + "&limit=" + limit + "&offset="+current_offset);
        const res = await fetch("api/v1/evictions" + query);
        if (res.ok) {
            const json = await res.json();
            total = json.length;
            console.log("Number of stats : " + total);
            queryT = query;
            console.log("queryT = " + queryT);

            changePageSearch(current_page, current_offset, query, total);
        } else if (res.status == 404) {
            total = 0;
            changePageSearch(current_page, current_offset, query, total);
        } else {
            alertError = "No se han encontrado datos.";
        }
    }
    function changePageSearch(page, offset, query, total) {
        console.log("------Change page------");
        console.log("Params page: " + page + " offset: " + offset);
        last_page = Math.ceil(total / 10);
        console.log("new last page: " + last_page);
        console.log(page, current_page, offset, query, total);
        if (page !== current_page) {
            current_offset = offset;
            current_page = page;
            console.log("page: " + page);
            console.log("current_offset: " + current_offset);
            console.log("current_page: " + current_page);
            console.log("la query es: " + query);
            getDataSearch(query);
        }
        console.log("---------Exit change page-------");
    }

    async function getNumData() {
        const res = await fetch("api/v1/evictions");
        if (res.ok) {
            const json = await res.json();
            total = json.length;
            console.log("Number of stats : " + total);
            changePage(current_page, current_offset);
        } else if (res.status == 404) {
            total = 0;
            changePage(current_page, current_offset);
        } else {
            alertError = "No se han encontrado datos.";
        }
    }

    //Calcula el rango entre dos valores
    function range(size, startAt = 0) {
        return [...Array(size).keys()].map((i) => i + startAt);
    }

    function changePage(page, offset) {
        console.log("------Change page------");
        console.log("Params page: " + page + " offset: " + offset);
        last_page = Math.ceil(total / 10);
        console.log("new last page: " + last_page);
        if (page !== current_page) {
            current_offset = offset;
            current_page = page;
            console.log("page: " + page);
            console.log("current_offset: " + current_offset);
            console.log("current_page: " + current_page);
            //NUEVO
            var campos = new Map(
                Object.entries(newEviction).filter((o) => {
                    return o[1] != "";
                })
            );
            let querySymbol = "?";
            for (var [clave, valor] of campos.entries()) {
                querySymbol += clave + "=" + valor + "&";
            }
            fullQuery = querySymbol.slice(0, -1);
            if (fullQuery != "") {
                searchData();
            } else {
                getData();
                getNumData();
            }
        }
        console.log("---------Exit change page-------");
    }

    async function insertEviction() {
        console.log("Inserting eviction " + JSON.stringify(newEviction));
        const res = await fetch("api/v1/evictions/", {
            method: "POST",
            body: JSON.stringify(newEviction),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function (res) {
            if (res.ok) {
                console.log("OK");
                getData();
                alertError = "";
                alertOk = `${newEviction.location} ${newEviction.year} ha sido insertado correctamente`;
                resetImputs();
            } else {
                if (res.status == 409) {
                    alertOk = "";
                    alertError = `Revise que los campos numéricos de ${newEviction.location} ${newEviction.year} contienen datos numéricos.`;
                } else if (res.status == 500) {
                    alertOk = "";
                    alertError = "Error al acceder a la base de datos";
                } else if (res.status == 400) {
                    alertOk = "";
                    alertError =
                        "Dato no añadido. Revise que no haya campos vacíos.";
                } else {
                    alertOk = "";
                    alertError =
                        "Todas las casillas deben ser rellenas correctamente";
                }
            }
            console.log("Error: " + alertError);
        });
    }

    async function resetImputs() {
        let resetEviction = {
            location: "",
            year: "",
            total: "",
            rustic: "",
            household: "",
            buildinglot: "",
            other: "",
        };
        newEviction = resetEviction;
    }

    async function searchData() {
        visitado = "si";
        console.log("Searching data...");
        var campos = new Map(
            Object.entries(newEviction).filter((o) => {
                return o[1] != "";
            })
        );
        let querySymbol = "?";
        let aux = "";
        for (var [clave, valor] of campos.entries()) {
            querySymbol += clave + "=" + valor + "&";
            if (clave == "year") {
                aux = aux + "Año=" + valor + " ";
            } else if (clave == "location") {
                aux = aux + "Localización=" + valor + " ";
            } else if (clave == "total") {
                aux = aux + "Total=" + valor + " ";
            } else if (clave == "rustic") {
                aux = aux + "Rústicas=" + valor + " ";
            } else if (clave == "household") {
                aux = aux + "Viviendas=" + valor + " ";
            } else if (clave == "buildinglot") {
                aux = aux + "Solares=" + valor + " ";
            } else {
                aux = aux + "Otras=" + valor + " ";
            }
        }
        fullQuery = querySymbol.slice(0, -1);
        if (fullQuery != "") {
            const limityOffset =
                "&limit=" + limit + "&offset=" + current_offset;
            const res = await fetch(
                "api/v1/evictions" + fullQuery + limityOffset
            );
            console.log("FULL QUERY: " + fullQuery + limityOffset);
            if (res.ok) {
                console.log("OK");
                const json = await res.json();
                evictionsDataTocho = evictionsData;
                evictionsData = json;
                console.log(
                    `We have received ${evictionsData.length} resources.`
                );
                alertError = "";
                alertOk = "Búsqueda realizada con éxito: " + aux;
            } else {
                if (res.status == 404) {
                    alertOk = "";
                    alertError = "No se encuentra el dato solicitado: " + aux;
                } else if (res.status == 500) {
                    alertOk = "";
                    alertError = "No se han podido acceder a la base de datos";
                }
                alertOk = "";
                console.log("Error: " + alertError);
            }
        } else {
            alertError = "";
            alertOk = "Búsqueda realizada con éxito";
            //getDataSearch();
            //getData();
        }

        getNumDataSearch(fullQuery);
        //getNumData(fullQuery);
    }

    function botonCancelar() {
        var cancelar = document.getElementById("cancelar").innerHTML;
        console.log("Boton cancelar " + cancelar);
        document.getElementById("cancelar").innerHTML =
            '<button style="border-radius:5px; margin-left:18px; padding:10px 8px; background-color: #dc3545; color:#fff; border-color: #dc3545;" onClick="window.location.reload();">Cancelar</button>';
    }

    async function deleteEviction(data) {
        console.log("Deleting eviction " + JSON.stringify(data));
        const res = await fetch(
            "api/v1/evictions/" + data.location + "/" + data.year,
            {
                method: "DELETE",
            }
        ).then(function (res) {
            if (res.ok) {
                alertError = "";
                alertOk =
                    data.location +
                    " " +
                    data.year +
                    " ha sido borrado correctamente";
                if (evictionsData.length == 1) {
                    evictionsData = [];
                    currentPage = 1;
                }
                console.log(`Resource has been deleted`);
                getData();
                getNumData();
            } else {
                if (res.status == 404) {
                    alertOk = "";
                    console.log = `Resource not found`;
                    alertError =
                        data.location +
                        " " +
                        data.year +
                        " no se ha borrado. Elemento no encontrado.";
                } else if (res.status == 500) {
                    console.log(`Database error`);
                    alertOk = "";
                }
            }
            console.log("Error: " + alertError);
        });
    }

    async function deleteData() {
        console.log("Deleting data...");
        const res = await fetch("api/v1/evictions/", {
            method: "DELETE",
        }).then(function (res) {
            if (res.ok) {
                console.log("OK");
                evictionsData = [];
                error = 0;
                getData();
                getNumData();
                alertOk = "Todos los datos se han borrado correctamente";
            } else if (res.status == 404) {
                error = 404;
                console.log("Error Data not found");
                alertError =
                    "No se han encontrado datos. No hay nada para borrar.";
                alertOk = "";
            } else if (res.status == 500) {
                console.log("Error al acceder a la base de datos");
                alertOk = "";
            } else {
                error = 1000;
                console.log("Error");
            }
        });
    }
    onMount(getData);
    getNumData();

    let checkMSG = "";
    let color = "danger";
    let page = 1;
    let totaldata=6;
</script>


<main>


    <h1>Consumo de CO2</h1>



{#await co2_stats}	
loading
	{:then stats}
	
	
	<Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
        {#if checkMSG}
		    {checkMSG}
	    {/if}
    </Alert>
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

				<td><Button outline color="primary" on:click="{insertEviction}">
					Añadir
					</Button>
				</td>

			</tr>
			{#each co2_stats as co2_stat}
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
					<td><Button outline color="danger" on:click={(co2_stat.country,co2_stat.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={loadData}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={deleteData}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>

<div class="paginacion">
	<Pagination ariaLabel="Web pagination">
		<PaginationItem class={current_page == 1 ? "disabled" : ""}>
			<PaginationLink	
				previous
				href="#/Co2StatsTable"
				on:click={() =>
					changePage(current_page - 1, current_offset - 10)}
			/>
		</PaginationItem>
		{#each range(last_page, 1) as page}
			<PaginationItem
				class={current_page == page ? "active" : ""}
			>
				<PaginationLink
					previous
					href="#/Co2StatsTable"
					on:click={() => changePage(page, (page - 1) * 10)}
					>{page}</PaginationLink
				>
			</PaginationItem>
		{/each}
		<PaginationItem
			class={current_page == last_page ? "disabled" : ""}
		>
			<PaginationLink
				next
				href="#/Co2StatsTable"
				on:click={() =>changePage(current_page + 1, current_offset + 10)}/>
		</PaginationItem>
	</Pagination>
</div>
{/await}
    

</main>