<script>

    import {onMount} from'svelte';
  
  let apiData = [];
  const delay = ms => new Promise(res => setTimeout(res, ms));


  async function getData(){
      const res = await fetch("/api/v2/co2-stats/loadInitialData");
      if (res.ok){
          const json = await res.json();
          console.log("dentro del ok "+JSON.stringify(json));
          guardaD(json);

          
         
      }else{
          console.log("Error in request");

          await delay(1000);
      }
      console.log("cargando el grafo ");
      loadGraph();
  }

  let tpc = [];
  let kg = [];
  let tot = [];
  let temporal=[];
  let countries = [];

  async function guardaD(json){
      for(let i = 0; i<json.length; i++){
            let aux = [];

            temporal.push(json[i].country);
            aux.push(json[i].country);

            aux.push(json[i].year);
            aux.push(json[i].co2_kg);

            kg.push(aux);

            aux = [];
            aux.push(json[i].year);
            aux.push(json[i].co2_tot);
            tot.push(aux);
              
            aux = [];
            aux.push(json[i].year);
            aux.push(json[i].co2_tpc);
            tpc.push(aux);
          }
          countries = temporal.filter((valor, indice) => {
            return temporal.indexOf(valor) === indice;
  }
);
          console.log("DATOOOOOOOO"+countries);
          console.log(countries[0]);
  }



    async function loadGraph(){
        
        console.log("grafo cargado");
        
       
     


        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "Megatoneladas de Co2 por pais y  año "
            },
            subtitles: [{
                text: "",
                fontSize: 16
            }],
            axisY: {
                prefix: "Mt:",
                scaleBreaks: {
                    customBreaks: [{
                        startValue: 10000,
                        endValue: 35000
                    }]
                }
            },
            data: [{
                type: "column",
                 yValueFormatString: "Megatoneladas de Co2: #,##0.00",
                
                dataPoints: [
                    

                    
                    { label: kg[0][0]+"--"+tot[0][0], y: tot[0][1] },
                    { label: kg[1][0]+"--"+tot[1][0], y: tot[1][1] },
                    { label: kg[2][0]+"--"+tot[2][0], y: tot[2][1] },
                    { label: kg[3][0]+"--"+tot[3][0], y: tot[3][1] },
                    { label: kg[4][0]+"--"+tot[4][0], y: tot[4][1] },
                    { label: kg[5][0]+"--"+tot[5][0], y: tot[5][1] },
                    { label: kg[6][0]+"--"+tot[6][0], y: tot[6][1] },
                    { label: kg[7][0]+"--"+tot[7][0], y: tot[7][1] },
                    { label: kg[8][0]+"--"+tot[8][0], y: tot[8][1] },
                    { label: kg[9][0]+"--"+tot[9][0], y: tot[9][1] },
                    { label: kg[10][0]+"--"+tot[10][0], y: tot[10][1] },


                    
                ]
            }]
        });
        chart.render();


    
    }
    
    </script>
   
<main>
    
    <div id="chartContainer" style="height: 300px; width: 100%;"></div>


</main>

<svelte:head>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"on:load="{getData}"></script>


</svelte:head>


