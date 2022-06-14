require("dotenv").config();

const appid = process.env.APPID;

console.log(appid);
//Eventlistener für das Formular
//addEventListener ('eventname', callback function)
const form = document.getElementById("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const userCity = document.querySelector("input").value;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${userCity},de&limit=1&appid=${appid}&units=metric&lang=de`;
  console.log(url);

  //Äußerer Fetch für Geocoding
  fetch(url)
    .then((response) => response.json())
    //.then((data) => ({ ...data[0]}))
    .then((data) => {
      //Prüfe ob es die Stadt gibt
      if (data.length === 0) {
        throw new Error("Die Stadt ist nicht vorhanden!");
      }
      return data[0];
    })
    //von einem Array zu dem ersten Wert: Object properties: lat/lon
    .then((geoCode) => {
      //Destrukturierung des Objekts geoCode (hier hole ich Werte lat, lon aus dem Objekt)
      const { lat, lon } = geoCode;

      //let city = geoCode.name;

      //console.log(local_names);
      /*
      if (geoCode.hasOwnProperty("local_names")) {
        city = geoCode.local_names.de;
      }
*/
      // variable = (true/false) ? wenn es true ist : wenn false ist
      const city = geoCode.hasOwnProperty("local_names")
        ? geoCode.local_names.de
        : geoCode.name;

      document.title = document.getElementById(
        "headline"
      ).innerText = `Das Wetter in ${city}`;
      //hier der innere/zweite Fetch fürs Wetter
      fetch(
        `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${appid}&units=metric&lang=de`
      )
        .then((response) => response.json())
        .then((wetter) => {
          const today = wetter.daily[0];
          const { temp, weather } = today;
          descr.innerText = weather[0].description;
          day.innerText = Math.round(temp.day) + "°";
          night.innerText = Math.round(temp.night) + "°";
          icon.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

          const weekday2 = wetter.daily[1];
          //const temp2 = wetter.daily[1].temp.day;
          //const { temp2, weather2 } = weekday2;

          /*
          descr2.innerText = wetter.daily[1].weather[0].description;
          day2.innerText = Math.round(wetter.daily[1].temp.day) + "°";
          night2.innerText = Math.round(wetter.daily[1].temp.night) + "°";
          icon2.src = `http://openweathermap.org/img/wn/${wetter.daily[1].weather[0].icon}@2x.png`;
          weekday2.innerText = wetter.daily[1].dt;
          */
          let date = new Date(1653476400);
          date = date.getDay();
          console.log(date);

          let cards = document.getElementsByClassName("card");

          const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

          //for Loop für jede Card
          for (let index = 0; index < cards.length; index++) {
            cards[index].children[0].innerText =
              weekdays[new Date(wetter.daily[index + 1].dt * 1000).getDay()];
            cards[index].children[1].src = `http://openweathermap.org/img/wn/${
              wetter.daily[index + 1].weather[0].icon
            }@2x.png`;
            cards[index].children[2].innerText =
              wetter.daily[index + 1].weather[0].description;
            cards[index].children[3].children[0].innerText =
              Math.round(wetter.daily[index + 1].temp.day) + "°";
            cards[index].children[3].children[1].innerText =
              Math.round(wetter.daily[index + 1].temp.night) + "°";
          }
        });

      document.getElementById("results").style.display = "block";
    })
    //Kodierungsfehler auffangen:
    .catch((error) => {
      fehler.innerText = error.message;
    });
});
