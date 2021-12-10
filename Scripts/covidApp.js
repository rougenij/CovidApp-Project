// Global Variables --> I think its better once i finish to switch them to local storage :thinkingemoji:
let countriesArr = [];
let countryCodeArr = [];
let covidDataArr = [];
let graphFor = "confirmed";
let currentRegion = "";

// Query Selectors + Creating Elements + ClassList
const spinner = document.querySelector("[data-spinner]");
//Data Holders for Search by Country
const totalCasesHolder = document.createElement("div");
totalCasesHolder.classList.add("main-data--totalcases");
const totalDeathHolder = document.createElement("div");
totalDeathHolder.classList.add("main-data--totaldeath");
const totalRecovered = document.createElement("div");
totalRecovered.classList.add("main-data--totalrecovered");
const criticalHolder = document.createElement("div");
criticalHolder.classList.add("main-data--criticalcases");
const newDeathHolder = document.createElement("div");
newDeathHolder.classList.add("main-data--newdeath");
const newCaseHolder = document.createElement("div");
newCaseHolder.classList.add("main-data--newcases");

const holderEl = document.createElement("div");
holderEl.classList.add("main-buttons-holder");
const canvesHoler = document.createElement("div");
canvesHoler.classList.add("canvas-holder");
const casesHolder = document.createElement("div");
casesHolder.classList.add("casesButtons");
const spinner = document.querySelector("[data-spinner]");
const canvasEl = document.createElement("canvas");
let myChart = new Chart(canvasEl, {});

// Creating continents buttons
const asiaBtn = document.createElement("button");
const americasBtn = document.createElement("button");
const europeBtn = document.createElement("button");
const africaBtn = document.createElement("button");
const worldBtn = document.createElement("button");

//Buttons that will display the graph
const casesBtn = document.createElement("button");
const deathsBtn = document.createElement("button");
const recoveredBtn = document.createElement("button");
const criticalBtn = document.createElement("button");
deathsBtn.textContent = "Death";
casesBtn.textContent = "Confirmed Cases";
recoveredBtn.textContent = "Recovered";
criticalBtn.textContent = "Critical Cases";

// Event Listeners for all the buttons + Window listener

deathsBtn.addEventListener("click", () => {
  graphFor = "deaths";
  fetchCountryByRegion(currentRegion);
});
casesBtn.addEventListener("click", () => {
  graphFor = "confirmed";
  fetchCountryByRegion(currentRegion);
});
recoveredBtn.addEventListener("click", () => {
  graphFor = "recovered";
  fetchCountryByRegion(currentRegion);
});
criticalBtn.addEventListener("click", () => {
  graphFor = "critical";
  fetchCountryByRegion(currentRegion);
});

dropDown.addEventListener("input", (e) => {
  fetchFromCountry(e.target.selectedOptions[0].getAttribute("code"));
});

window.addEventListener("load", () => {
  fetchCountryByRegion("");
});

async function fetchCountryByRegion(region) {
  spinner.classList.toggle("none");
  try {
    const response = await fetch(
      `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1${region}`
    );
    const data = await response.json();
    console.log(data);
    dropDown.innerHTML = "";
    countriesArr = [];
    countryCodeArr = [];
    covidDataArr = [];
    myChart.destroy();
    for (let i = 0; i < data.length; i++) {
      if (data[i].name.common === "Kosovo") {
        continue;
      }
      countriesArr.push(data[i].name.common);
      countryCodeArr.push(data[i].cca2);
      const optionsInDropDown = document.createElement("option");
      optionsInDropDown.textContent = data[i].name.common;
      dropDown.appendChild(optionsInDropDown);
    }

    for (let country of countryCodeArr) {
      if (countryCodeArr.includes(country)) {
        try {
          const fetchCovidData = await fetch(
            `https://intense-mesa-62220.herokuapp.com/http://corona-api.com/countries/${country}`
          );
          const covidData = await fetchCovidData.json();
          covidDataArr.push(covidData.data.latest_data[graphFor]);
        } catch (err) {
          console.log("failed", err);
        }
      }
    }
    drawingChart(graphFor, countriesArr, covidDataArr);
  } catch (err) {
    console.log("failed", err);
  }
  spinner.classList.toggle("none");
}

function drawingChart(graphFor, countryNames, countryCovidData) {
  myChart = new Chart(canvasEl, {
    type: "bar",
    data: {
      labels: countryNames,
      datasets: [
        {
          label: `COVID-19 ${graphFor}`,
          data: countryCovidData,
          backgroundColor: [""],
          borderColor: [""],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

async function fetchFromCountry(code) {
  spinner.classList.toggle("none");
  deathsEl.textContent = "";
  confirmedEl.textContent = "";
  recoveredEl.textContent = "";
  criticalEl.textContent = "";
  newDeathsEl.textContent = "";
  newConfirmedEl.textContent = "";
  try {
    const fetchingData = await fetch(
      `https://corona-api.com/countries/${code}`
    );
    const covidData = await fetchingData.json();
    const deaths = covidData.data.latest_data.deaths;
    const confirmed = covidData.data.latest_data.confirmed;
    const recovered = covidData.data.latest_data.recovered;
    const critical = covidData.data.latest_data.critical;
    const newDeaths = covidData.data.today.deaths;
    const newConfirmed = covidData.data.today.confirmed;

    deathsEl.textContent = deaths;
    confirmedEl.textContent = confirmed;
    recoveredEl.textContent = recovered;
    criticalEl.textContent = critical;
    newDeathsEl.textContent = newDeaths;
    newConfirmedEl.textContent = newConfirmed;

    totalCasesHolder.appendChild(confirmedEl);
    totalDeathHolder.appendChild(deathsEl);
    totalRecovered.appendChild(recoveredEl);
    criticalHolder.appendChild(criticalEl);
    newDeathHolder.appendChild(newDeathsEl);
    newCaseHolder.appendChild(newConfirmedEl);
  } catch (err) {
    console.log("failed", err);
  }
  spinner.classList.toggle("none");
}
