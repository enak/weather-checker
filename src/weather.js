/** Reach out to Weather Underground to get the forecast. */
var request = require('request');

function getUrl(key, zip) {
  return 'http://api.wunderground.com/api/' + key + '/forecast/q/' + zip + '.json';
}

class WeatherClient {
  constructor (key) {
    this.key = key;
  }

  getWeather(zip, callback) {
    request(getUrl(this.key, zip), callback);
  }
}

module.exports = function(key) {
  return new WeatherClient(key);
};