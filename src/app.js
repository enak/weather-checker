console.log('starting the io app');


if (!process.env.WUNDERGROUND) {
  console.error('WUNDERGROUND not specified');
  process.exit();
}

const io = require('./io');
const weatherClient = require('./weather')(process.env.WUNDERGROUND);

function sendWeather(weatherSocket) {
  weatherClient.getWeather(weatherSocket.getZip(), (function(weatherSocket) {
    return function (error, response, body) {
      if (error) {
        console.log('error:', error);
        return;
      }

      console.log('request status code:', response && response.statusCode);

      var data = JSON.parse(body);
      var today = data.forecast.simpleforecast.forecastday[0];
      weatherSocket.updateTempurature(today.high.fahrenheit, today.low.fahrenheit);
    };
  })(weatherSocket));
}

var sockets = [];
io.on('connection', function(socket) {
  sockets.push(new WeatherSocket(socket));
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

  updateTempurature(high, low) {
    this.socket.emit('set temp', {
      high, low
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

setInterval(function() {
  sockets.forEach(function(weatherSocket) {
    sendWeather(weatherSocket);
  });
}, 30000);

setInterval(function() {
  sockets.forEach(function(weatherSocket) {
    if (weatherSocket.isWaitingForUpdate()) {
      weatherSocket.setDoneWaitingForUpdate();
      sendWeather(weatherSocket);
    }
  });
}, 5000);