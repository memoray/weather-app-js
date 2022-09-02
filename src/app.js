require("dotenv").config();

const appid = process.env.APPID;

console.log(appid);
const form = document.getElementById("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const userCity = document.querySelector("input").value;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${userCity},de&limit=1&appid=${appid}&units=metric&lang=de`;
  console.log(url);

  //Äußerer Fetch für Geocoding
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        throw new Error("Die Stadt ist nicht vorhanden!");
      }
      return data[0];
    })
    //Object properties: lat/lon
    .then((geoCode) => {
      const { lat, lon } = geoCode;
      const city = geoCode.hasOwnProperty("local_names")
        ? geoCode.local_names.de
        : geoCode.name;

      document.title = document.getElementById(
        "headline"
      ).innerText = `Das Wetter in ${city}`;
      //Innerer Fetch fürs Wetter
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
          let date = new Date(1653476400);
          date = date.getDay();
          console.log(date);

          let cards = document.getElementsByClassName("card");

          const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

          //Loop für jede Card
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
    .catch((error) => {
      fehler.innerText = error.message;
    });
});
