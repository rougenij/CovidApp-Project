// Global Variables --> I think its better once i finish to switch them to local storage :thinkingemoji:
let countriesArr = [];
let countryCodeArr = [];
let covidDataArr = [];
let chartColorsArr = [[], []];
let graphFor = "confirmed";

const canvasEl = document.createElement("canvas");
let myChart = new Chart(canvasEl, {});

// Creating continents buttons
const asiaBtn = document.createElement("button");
const americasBtn = document.createElement("button");
const europeBtn = document.createElement("button");
const africaBtn = document.createElement("button");
const worldBtn = document.createElement("button"); // Add this API https://corona-api.com/countries

//Buttons that will display the graph
const casesBtn = document.createElement("button");
const deathsBtn = document.createElement("button");
const recoveredBtn = document.createElement("button");
const criticalBtn = document.createElement("button");

//Creating the DropDown Menu
const dropDown = document.createElement("select");
window.addEventListener("load", () => {
  const fetching = async () => {
    try {
      const allData = await fetch(
        "https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1"
      );
      const data = await allData.json();
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const optionsInDropDown = document.createElement("option");
        optionsInDropDown.textContent = data[i].name.common;
        dropDown.appendChild(optionsInDropDown);
      }
    } catch (err) {
      console.log("failed", err);
    }
  };
  fetching();
});
//! Since im fetching the entire data here, basically i can store all this info, and then for each button, i can just go over the data and then display every country that has same continent

//Adding Text content to Each button
asiaBtn.textContent = "Asia";
americasBtn.textContent = "America";
europeBtn.textContent = "Europe";
africaBtn.textContent = "Africa";
worldBtn.textContent = "World";

document.body.appendChild(asiaBtn);
document.body.appendChild(americasBtn);
document.body.appendChild(europeBtn);
document.body.appendChild(africaBtn);
document.body.appendChild(worldBtn);
document.body.appendChild(dropDown);
document.body.appendChild(canvasEl);

asiaBtn.addEventListener("click", () => {
  fetchCountryByRegion("/region/Asia");
});
americasBtn.addEventListener("click", () => {
  fetchCountryByRegion("/region/Americas");
});
europeBtn.addEventListener("click", () => {
  fetchCountryByRegion("/region/Europe");
});
africaBtn.addEventListener("click", () => {
  fetchCountryByRegion("/region/Africa");
});

worldBtn.addEventListener("click", () => {
  fetchCountryByRegion("");
});

async function fetchCountryByRegion(region) {
  try {
    const response = await fetch(
      `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1${region}`
    );
    const data = await response.json();
    console.log(data);
    dropDown.innerHTML = "";
    countriesArr = [];
    countryCodeArr = [];
    myChart.destroy(); //! Why??
    for (let i = 0; i < data.length; i++) {
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
    drawingChart(graphFor, countriesArr, covidDataArr, chartColorsArr);
  } catch (err) {
    console.log("failed", err);
  }
}

function drawingChart(graphFor, countryNames, countryCovidData, chartColors) {
  myChart = new Chart(canvasEl, {
    type: "bar",
    data: {
      labels: countryNames,
      datasets: [
        {
          label: `COVID-19 ${graphFor}`,
          data: countryCovidData,
          backgroundColor: chartColors[0],
          borderColor: chartColors[1],
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
