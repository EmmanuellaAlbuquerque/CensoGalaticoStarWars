const planetInfo = document.getElementById("planet_info");

function getPlanetInfo(planet) {
  planetInfo.innerHTML = "";

  infos = ["name", "climate", "population", "terrain"];
  info_div = document.createElement("div");

  infos.forEach((info) => {
    let p_info = document.createElement("p");
    p_info.innerHTML = `<strong>${capitalizeFirstLetter(info)}:</strong> ${
      planet[`${info}`]
    }`;
    info_div.appendChild(p_info);
  });

  planetInfo.appendChild(info_div);
  getResidentsInfo(planet.residents);
}

function capitalizeFirstLetter([first, ...rest_array]) {
  return first.toUpperCase() + rest_array.join("");
}

async function getPlanetByName() {
  let planetName = document.getElementById("planet_name").value;

  let response = await fetch(
    `https://swapi.dev/api/planets/?search=${planetName}&?format=json`
  );

  let json = await response.json();
  let planet = json.results[0];

  if (planet) {
    getPlanetInfo(planet);
  } else {
    planetInfo.innerHTML = "";

    let dontExist = document.createElement("p");
    let dontExistText = `<strong>O planeta '${planetName}' não existe!!!</strong>`;
    dontExist.innerHTML = dontExistText;

    planetInfo.appendChild(dontExist);

    removeTable();
  }
}

function removeTable() {
  let table_wrapper = document.getElementById("table_wrapper");
  table_wrapper.innerHTML = "";
}

async function getPlanets() {
  let response = await fetch("https://swapi.dev/api/planets/?format=json");
  let { results } = await response.json();
  let galaxyDiv = document.getElementById("galaxy");

  console.log(results);

  results.forEach((planet) => {
    let button = document.createElement("button");

    button.innerText = planet.name;
    button.onclick = () => getPlanetInfo(planet);

    galaxyDiv.appendChild(button);
  });
}

function createTableHeader(table) {
  let headers = ["Name", "Birth Year"];
  let thHead = document.createElement("thead");
  let thRow = document.createElement("tr");
  thHead.appendChild(thRow);

  headers.forEach((headerName) => {
    let th = document.createElement("th");
    th.textContent = headerName;
    thRow.appendChild(th);
  });

  table.appendChild(thHead);
}

function createTableBody(table, residents) {
  console.log("-------------------------------");

  let tbody = document.createElement("tbody");

  if (residents.length > 0) {
    residents.forEach(async (resident_url) => {
      let response = await fetch(`${resident_url}?format=json`);
      let residents = await response.json();

      let row = document.createElement("tr");
      let nameCell = document.createElement("td");
      nameCell.textContent = residents.name;
      row.appendChild(nameCell);

      console.log(residents.name);

      let birthYearCell = document.createElement("td");
      birthYearCell.textContent = residents.birth_year;
      row.appendChild(birthYearCell);

      tbody.appendChild(row);
    });
  } else {
    let row = document.createElement("tr");
    row.innerHTML =
      "<td id='no_residents'>Não existem residentes nesse planeta!</td>";
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
}

function getResidentsInfo(residents) {
  let table_wrapper = document.getElementById("table_wrapper");
  table_wrapper.style.display = "block";

  table_wrapper.innerHTML = "";

  let h3Residents = document.createElement("h3");
  h3Residents.textContent = "Residents";
  table_wrapper.appendChild(h3Residents);

  let table = document.createElement("table");
  table_wrapper.appendChild(table);
  table.id = "residents_table";

  createTableHeader(table);

  createTableBody(table, residents);
}

getPlanets();
