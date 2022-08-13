const startDateInput = document.getElementById("start");
const endDateInput = document.getElementById("end");
const currencyInput = document.getElementById("currency");
let currency = currencyInput.value;
let start;
let end;
const baseUrl = "https://api.coindesk.com/v1/bpi/historical/close.json";

// WARNING, WEIRD API TRICKS. BE WARNED. HERE BE HACKS
function makeZeroDate(number) {
  return number.toString().padStart(2, "0");
}

function turnDateToString(date, isStart) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (year === 2022 && month >= 7 && isStart) {
    return `${year - 1}-${makeZeroDate(month)}-${makeZeroDate(day)}`;
  }

  return `${year}-${makeZeroDate(month)}-${makeZeroDate(day)}`;
}

startDateInput.onchange = (event) => {
  console.log(event.target.value);
  start = event.target.value;
  getHistoricalData();
};

endDateInput.onchange = (event) => {
  end = event.target.value;
  getHistoricalData();
};

currencyInput.onchange = (event) => {
  currency = event.target.value;
  getHistoricalData();
};

function getHistoricalData() {
  const startDate = start ? new Date(start) : new Date();
  const endDate = end ? new Date(end) : new Date();

  if (endDate < startDate) {
    return `Go Home You are Drunk Off Your Marbels. More Tobacco in that cigarrette, please. `;
  }

  //   in axios terms, params are equivalent to our req.query
  axios
    .get(baseUrl, {
      params: {
        start: turnDateToString(startDate, true),
        end: turnDateToString(endDate),
        currency,
      },
    })
    .then((data) => {
      const allMonths = Object.keys(data.data.bpi);
      const allPrices = Object.values(data.data.bpi);
      drawChart(allMonths, allPrices);
    });
}

const ctx = document.getElementById("myChart").getContext("2d");
let chart;
function drawChart(labels, data) {
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "value of bitcoin",
          data,
        },
      ],
    },
  });
}

getHistoricalData();
