  const API_KEY = "AIzaSyAoYSJ-B-i4r-jgl0n3is3VJMgBhVhwy44";
  const SHEET_ID = "1UK356MwkhS73fkZHGkeQwS_UBx9YpTf9dIunNaGbXLw";

  let ptable; //just values, no meta-data
    //prototype table in google sheet format, later turned into json format
  let table;
  let titles; 
    //names of all object parameters 
    let data = {
  "name": "",
  "range": "",
  "date": "",
  "location": "",
  }
  let glng;
  let glat;
  let pointer = null;

main()
 async function main(){

  await loadData();
  table = await STO(ptable);
  //do not mess w awaits here
  //showdata();
  const map = await loadmap();
  loadmarkers(map);

  document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    //data is the object that holds the packet sent to the sheet
    data.name = document.getElementById("nameid").value;
    data.range = [document.getElementById("range1id").value, document.getElementById("range2id").value];
    data.date = Date();
    console.log ([glat, glng]);
    data.location = ([glng, glat]);
    submitData(data);

    //clears what you inputted into the boxes after you press submit
    function clearSubmitInputs() {
      document.getElementById("nameid").value = "";
      document.getElementById("range1id").value = "";
      document.getElementById("range2id").value = "";
      document.getElementById("dateid").value = "";
      document.getElementById("descriptionid").value = "";
      document.getElementById("addressid").value = "";
    }

    clearSubmitInputs();
    });

  //records clicks on the map 
  map.on('click', (e)=> {
    const lng = e.lngLat.lng
    const lat = e.lngLat.lat
    if (!pointer)
    { 
      pointer = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    }
    else{
      pointer.setLngLat([lng, lat]);
    }
    glng = lng; glat = lat;
    console.log (glat, glng);
  });

  
}
//End of main

async function submitData(data) {

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbw2ee_ikBNXYbDr28sOgk6cS8v8QHHwsHGMZku6ANpxN81_llGdzTea66Bmr3OkrLMDAQ/exec",
    {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
  console.log("Data sent!");
}

function showdata(){
  const newEntry = document.createElement("ul")

  table.forEach((obj,i) => {
    const newLine = document.createElement("li");

      ptable[0].forEach(para =>{
      newLine.textContent += (table[i][para]+ ', ');
      });
    newEntry.appendChild(newLine);
  });
  document.getElementById("userlist").appendChild(newEntry);
}

async function loadData() {
    //customize later with creating API keys with login information, for now just global access is fine 
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    ptable = data.values;
    //console.log(data.values); // array of rows
  }

async function finddata(){

}

function STO(values){
  const headers = values[0]; //headers are now an array of object titles 
  const rows = values.slice(1); //stop at 1

 return rows.map((row) => { 
    
    const obj={}; //self explanatory

    headers.forEach((header,i) => {
    obj[header] = row[i] ?? ""; //exclude if Null or undef
    });

    return obj;
  });
}

function loadmap(){
  mapboxgl.accessToken = 'pk.eyJ1IjoiY2l2aWMtbGluayIsImEiOiJjbWdwbzd6c2kyY3dyMmpuMnpxMTBrMm13In0.KY2MzBxSk5XV2TcEWe3MQA';
  const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: [-74.5, 40], // starting position [lng, lat]
	zoom: 8, // starting zoom
});
return map;
}
async function loadmarkers(map){
    const locations = await table.map(obj => obj.location);
    console.log(locations); 

    locations.forEach(location => {
      const coords = location.split(",").map(Number);
      console.log(coords)

      if (
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number"
      )
        {
        const marker = new mapboxgl.Marker().setLngLat([coords[0],coords[1]]).addTo(map);
        marker;
        console.log(marker)
        }  
        else{
          console.log(location)
          console.log("refused")
        }
    });
}