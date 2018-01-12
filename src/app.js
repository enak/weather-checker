console.log('starting the io app');


if (!process.env.WUNDERGROUND) {
  console.error('WUNDERGROUND not specified');
  process.exit();
}

const io = require('./io');
const weatherClient = require('./weather')(process.env.WUNDERGROUND);
let day = 0;

function sendWeather(weatherSocket) {
  weatherClient.getWeather(weatherSocket.getZip(), (function(weatherSocket) {
    return function (data) {
      var today = data.data.forecast.simpleforecast.forecastday[day];
      weatherSocket.updateTempurature(today.high.fahrenheit, today.low.fahrenheit, data);
    };
  })(weatherSocket));
}

var sockets = [];
io.on('connection', function(socket) {
  sockets.push(new WeatherSocket(socket));

  socket.on('change day', function(newDay) {
    if (day != newDay) {
      day = newDay;
      updateAll();
    }
  });
});

class WeatherSocket {
  constructor(socket) {
    this.socket = socket;

    socket.on('set zip', (message) => {
      this.zip = message;
      this.waitingForUpdate = true;
    });

    socket.on('request update', (message) => {
      this.waitingForUpdate = true;
    })
  }

  updateTempurature(high, low, data) {
    var days = data.data.forecast.simpleforecast.forecastday.map(function (forecast) {return forecast.date.weekday});

    this.socket.emit('set temp', {
      high, low, days
    });
  }

  isWaitingForUpdate() {
    return !!this.waitingForUpdate;
  }

  getZip() {
    return this.zip;
  }

  setDoneWaitingForUpdate() {
    this.waitingForUpdate = false;
  }
}

function updateAll() {
  sockets.forEach(function(weatherSocket) {
    sendWeather(weatherSocket);
  });
}

setInterval(function() {
  updateAll();
}, 30000);

setInterval(function() {
  sockets.forEach(function(weatherSocket) {
    if (weatherSocket.isWaitingForUpdate()) {
      weatherSocket.setDoneWaitingForUpdate();
      sendWeather(weatherSocket);
    }
  });
}, 5000);