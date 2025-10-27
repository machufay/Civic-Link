
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
  "description": "",
  "id": "",
  "address": ""
}
let glng;
let glat;
let pointer = null;
let allMarkers = [];

  var path = window.location.pathname;
  var page = path.split("/").pop();
  console.log( page );

main()
async function main() {

  await loadData();
  table = await STO(ptable);
  //do not mess w awaits here
  showrecent();
  const map = await loadmap();
  loadmarkers(map);

  if (page === "submit.html"){
    document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    //data is the object that holds the packet sent to the sheet
    data.name = document.getElementById("nameid").value;
    console.log(document.getElementById("nameid").value);
    data.range = [document.getElementById("range1id").value, document.getElementById("range2id").value];
    data.date = Date();
    console.log([glat, glng]);
    data.location = ([glng, glat]);
    data.description = document.getElementById("descriptionid").value;
    data.id = (Math.random() * 10000000000000000);
    // Fix: Await reverseGeocode and set address after glng, glat are set
    data.address = await reverseGeocode(glng, glat);
    console.log(data);
    
    console.log(data.id);
    const marker = new mapboxgl.Marker().setLngLat([glng, glat]).addTo(map);
    marker;
   
    submitData(data);

    // Add popup to the new marker
    const popupContent = `
      <div style="color: black;">
        <strong>Name:</strong> ${data.name}<br>
        <strong>Range:</strong> ${data.range}<br>
        <strong>Date:</strong> ${data.date}<br>
        <strong>Description:</strong> ${data.description}<br>
        <strong>Address:</strong> ${data.address}
      </div>
    `;
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
    
    marker.setPopup(popup);
    allMarkers.push(marker);
    marker;

    //clears what you inputted into the boxes after you press submit
    function clearSubmitInputs() {
      document.getElementById("nameid").value = "";
      document.getElementById("range1id").value = "";
      document.getElementById("range2id").value = "";
      document.getElementById("descriptionid").value = "";
      
    }
    clearSubmitInputs();
//Popup for submit (tells user their submission was successful)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("projectForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // prevents page reload
    alert("Project submitted!"); // shows the popup
    form.reset(); // optional: clears the form fields
  });
});

  });
  }
  else{}
  
  //records clicks on the map 

  map.on('click', (e) => {
    if (page === "index.html")
    {
      return;
    }
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;
    // viewport based click tolerance 
    const clickPoint = map.project([lng, lat]);
    const pixelTolerance = 25; // pixels
    let onMarker = false;
    allMarkers.forEach(m => {
      const markerLngLat = m.getLngLat();
      const markerPoint = map.project([markerLngLat.lng, markerLngLat.lat]);
      const dx = markerPoint.x - clickPoint.x;
      const dy = markerPoint.y - clickPoint.y;
      
      if (Math.sqrt(dx * dx + dy * dy) < pixelTolerance) {
        onMarker = true;
      }
      //prevents marker from generating if clicked twice 

    });

    if (onMarker) return;

    if (!pointer) {
      pointer = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    }
    else {
      pointer.setLngLat([lng, lat]);
    }
    
    glng = lng; glat = lat;
    console.log(glat, glng);
  });

}

async function submitData(data) {

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbx6nM4ig2c6E6yFyk8bKNRXhStCPj7wIPoamrtNYJ57pxi_xC0Ni0qdy0tCBmUs10090A/exec",
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



function DDMMYY (date){
  date = date.split(" ");
  const newDate = [date[2], date[1], date[3]]
  return newDate;
}
function HHMMSS (date){
  date = date.split(" ");
  const newtime = date[4].split(":")
  console.log(newtime)
  return newtime;
}
function evalTime (ptime){
  let count = 0;
  count += ptime[0]*3600;
  count += ptime[1]*60;
  count += ptime[2];
  console.log(count)
  return count;
}

function showrecent(){
  const newEntry = document.createElement("ul")
  //YYMMDDHHMMSS
  const now = new Date();
  for (let i = table.length - 1; i >= 0; i--) {
    if (!table[i]["date"]) return;
    // Turn string into a Date object
    const entryDate = new Date(table[i]["date"]);
    if (
      now.getFullYear() === entryDate.getFullYear() &&
      now.getMonth() === entryDate.getMonth() &&
      now.getDate() === entryDate.getDate()
    ) {
      const dtime = (now.getTime() - entryDate.getTime()) / 1000; // seconds
      const newLine = document.createElement("li");
      console.log(table[i]["name"])

      if (!table[i]["name"]){
      continue;
      }
      // Put name and address on separate lines in the list item
      const nameEl = document.createElement('strong');
      nameEl.textContent = table[i]["name"];
      newLine.appendChild(nameEl);
      newLine.appendChild(document.createElement('br'));

      const addrEl = document.createElement('span');
      addrEl.textContent = table[i]["address"];
      newLine.appendChild(addrEl);

      // compute relative time string
      let timeText = '';
      if (dtime < 60) timeText = Math.round(dtime) + " sec ago";
      else if (dtime < 1800) timeText = Math.round(dtime / 60) + " min ago";
      else if (dtime < 3600) timeText = "less than an hr ago";
      else timeText = Math.round(dtime / 3600) + " hrs ago";

      // append time after address (keeps previous appearance)
      newLine.appendChild(document.createTextNode(', ' + timeText));
      newEntry.appendChild(newLine);
    }
  }
  if (page == "index.html")
  {
    newEntry.id = "updateslist";
    document.getElementById("updates").appendChild(newEntry);
    console.log("true");
  }
}

async function loadData() {
    //customize later with creating API keys with login information, for now just global access is fine 
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    ptable = data.values;
    //console.log(data.values); // array of rows
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
	center: [-87.5, 37.9], // starting position [lng, lat]
	zoom: 3, // starting zoom
});

const geocoder = new mapboxsearch.MapboxGeocoder()

    // set the mapbox access token, geocoding API options
    geocoder.accessToken = mapboxgl.accessToken
    geocoder.options = {
      language: 'en'
    }
    // set the mapboxgl library to use for markers and enable the marker functionality
    geocoder.mapboxgl = mapboxgl
    geocoder.marker = false
    
    console.log(geocoder.marker);
    // bind the geocoder instance to the map instance
    geocoder.bindMap(map)
    geocoder.options = {
            country: ["US"],
            proximity: [-87.5, 37.9],
            worldview: ["us"]           
        };
    // add the geocoder instance to the DOM
    document.getElementById('map').appendChild(geocoder);
return map;
}

async function loadmarkers(map){
    const locations = await table.map(obj => obj.location);

    table.forEach((obj, i) => {
      const location = obj.location;
      const coords = location.split(",").map(Number);

      if (
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number"
      )
        {
        const marker = new mapboxgl.Marker().setLngLat([coords[0],coords[1]]).addTo(map);
        // Create popup content from object data

        const DateRange = obj.range.split(",");
        const popupContent = `
          <div style="color: black;">
            <strong>Name:</strong> ${obj.name || ""}<br>
            <strong>Range:</strong> ${DateRange[0] || ""} to ${DateRange[1] || ""}<br>
            <strong>Description:</strong> ${obj.description || ""}<br>
            <strong>Address:</strong> ${obj.address || ""}
          </div>
        `;
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
        marker.setPopup(popup);
        allMarkers.push(marker);
        }  
        else{
          console.log(location)
          console.log("refused")
        }
    });
}

//scrapped not gonna use anymore
async function deleteRowById(id) {
  const url = `YOUR_WEB_APP_URL?deleteId=${encodeURIComponent(id)}`;
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);
}


// Reverse geocoding function using Mapbox API
async function reverseGeocode(lng, lat) {
  const accessToken = mapboxgl.accessToken;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      // Return the most relevant place name (address)
      return data.features[0].place_name;
    } else {
      return "Address not found";
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Error fetching address";
  }
}

