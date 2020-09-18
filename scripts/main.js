const api = {
  key: 'f8cfc666e6a1218a1237564a2c92cf7e',
  base: 'https://api.openweathermap.org/data/2.5/',
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
let notify = document.querySelector('.notification');

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults);
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name},${weather.sys.country}`;
  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);
  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
  let weather_el = document.querySelector('.current .weather');
  weather_el.innerHTML = weather.weather[0].main;
  let high_low = document.querySelector('.current .hi-low');
  high_low.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(
    weather.main.temp_max
  )} °c`;
}

function dateBuilder(d) {
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  return `${day} ${date} ${month} ${year}`;
}

const notifyMe = () => {
  console.log('hello');
  Notification.requestPermission((result) => {
    if (result !== 'granted') {
      alert('Kindly enable notifcation to get notified');
    } else {
      displayConfirmNotification();
    }
  });
};

const displayConfirmNotification = () => {
  if ('serviceWorker' in navigator) {
    let options = {
      body: 'You have been subscribed',
      icon: './images/icons/haze192.png',
      image: './images/icons/2295240-200.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        {
          action: 'Confirm',
          title: 'Okay',
        },
        {
          action: 'Cancel',
          title: 'Cancel',
        },
      ],
    };

    navigator.serviceWorker.ready.then((sw) => {
      sw.showNotification(
        'You successfully subscribed to be notified!',
        options
      );
    });
  }
};
//check browsers support for notification
if ('Notification' in window) {
  notify.style.display = 'block';
  notify.addEventListener('click', notifyMe);
}
