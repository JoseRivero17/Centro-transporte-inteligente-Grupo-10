// Hora dinámica simulada

const departures = [
  "08:30 AM",
  "09:15 AM",
  "10:45 AM",
  "12:00 PM",
  "13:30 PM",
  "15:00 PM"
];

let index = 0;

const departureElement = document.getElementById("nextDeparture");

setInterval(() => {
  index++;

  if(index >= departures.length){
    index = 0;
  }

  departureElement.textContent = departures[index];

}, 4000);