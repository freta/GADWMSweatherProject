const api = {
  key: 'f8cfc666e6a1218a1237564a2c92cf7e',
  base: 'https://api.openweathermap.org/data/2.5/',
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);
let notify = document.querySelector('.notification');
let city = document.querySelector('.location .city');
let temp = document.querySelector('.current .temp');
let weather_el = document.querySelector('.current .weather');
let high_low = document.querySelector('.current .hi-low');

let weatherArray = JSON.parse(localStorage.getItem('data')) || [];
let content = document.querySelector('.content');
// console.log(weatherArray);

function setQuery(evt) {
  // evt.preventDefault();
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
    searchbox.value = '';
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
    .then((response) => response.json())
    .then((weather) => {
      weatherArray.unshift(weather);
      localStorage.setItem('data', JSON.stringify(weatherArray));
      setTimeout(() => {
        location.reload();
      }, 300);
    })
    .then(displayResults(weatherArray));
}

function displayResults(data) {
  let mappedArr = data.map((weather) => {
    return `<main>
  <section class="location">
    <div class="city">${weather.name}</div>
    <div class="date">${weather.main.humidity}</div>
  </section>
    <div class="current">
    <div class="temp">${weather.main.temp}<span>°c</span></div>
    <div class="weather">${weather.weather[0].main}</div>
    <div class="hi-low">${weather.main.temp_min}${weather.main.temp_max}</div>
  </div>
</main>`;
  });
  mappedArr = mappedArr.join('');
  content.innerHTML = mappedArr;
}

const notifyMe = () => {
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
