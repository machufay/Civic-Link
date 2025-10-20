# Civic Link
A website aimed to let city engineers post construction updates about their community.

# To Do List:

Frontend:
- create div that appears in home page for every project submitted
- reposition the submit form so it's maneuverable (look at backend notes below)

Backend:
- Lock in map markers onto map when press submit
- make home-page display map uneditable
- Make adding a description possible
- make way to edit submission
- ~~Location doesn't work~~
- ~~Find way to allow user to submit google coords~~
- ~~Create login backend (w/ node.js and host it to the internet using a free site like Render)~~

# HOSTING LOGIN BACKEND SERVER ON NODE.JS:
The login backend is hosted on node.js locally, meaning if you do not host the server on your computer the login will not work.
If you try logging in without hosting, it will say "server error".

Hosting login backend:
1) download node.js 
2) in vscode terminal, type: "node backendLogin/server.js"
4) if it says: "✅ Server running on http://localhost:5000", then the server is hosted and logins should work locally.
5) to turn off server: "ctrl+C" in terminal

# Key things to note abt messy backend
- Google maps have been switched to mapbox 

- mapbox REQUIRES you to include it's own stylesheet (for specifying map) and it's own js sheet 
    put the following code into the <head> of any HTML file if you want a map there
    ~
    <link href='https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css' rel='stylesheet' />
    <script defer src='https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js'></script>
    ~
- The physical map itself will be <div id = "map"></div>
    - if you're not testing it's functions change it's id to <div id = "map-test"></div> to make it turn green 
    - or just change it to anything other than the id "map"

- After that you need to have this in the script section of the page, very much customizable 
<script>
function loadmap(){

  mapboxgl.accessToken = 'pk.eyJ1IjoiY2l2aWMtbGluayIsImEiOiJjbWdwbzd6c2kyY3dyMmpuMnpxMTBrMm13In0.KY2MzBxSk5XV2TcEWe3MQA';
  const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: [-74.5, 40], // starting position [lng, lat]
	zoom: 8, // starting zoom
    });
}
loadmap();
<script>

Google Sheets:
https://docs.google.com/spreadsheets/d/1UK356MwkhS73fkZHGkeQwS_UBx9YpTf9dIunNaGbXLw/edit?gid=0#gid=0


