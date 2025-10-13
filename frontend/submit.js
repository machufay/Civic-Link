  const API_KEY = "AIzaSyAoYSJ-B-i4r-jgl0n3is3VJMgBhVhwy44";
  const SHEET_ID = "1UK356MwkhS73fkZHGkeQwS_UBx9YpTf9dIunNaGbXLw";

  let ptable; //just values, no meta-data
    //prototype table in google sheet format, later turned into json format
  let table;
  let titles; 
    //names of all object parameters 

main()
 async function main(){

  await loadData();
  table = await STO(ptable);
  //do not mess w awaits here
  showdata()

document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const age = document.getElementById("ageid").value;
    const name = document.getElementById("nameid").value;
    //const date = document.getElementById("dateid").value;
    const date = Date();
    const location = document.getElementById("locationid").value;
    console.log(location);
    submitData(name, age, date, location);
    

    //clears what you inputted into the boxes after you press submit
    function clearSubmitInputs() {
      document.getElementById("nameid").value = "";
      document.getElementById("ageid").value = "";
      document.getElementById("dateid").value = "";
      document.getElementById("locationid").value = "";
    }
    clearSubmitInputs();
  });

}

async function submitData(name, age, date, location) {
  const data = { name, age, date, location};
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbyn_fJ3jlHz4OiKMP4vKbH1xN5b00H1GujO35r8FWykwFY2ZxqbOK-wt-ZwCllzu4FQZQ/exec",
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

