/** Reach out to Weather Underground to get the forecast. */
const nimbus = require('@nnelson/nimbus')();
const weatherCache = {};

function getUrl(key, zip) {
  return 'http://api.wunderground.com/api/' + key + '/forecast/q/' + zip + '.json';
}

class WeatherClient {
  constructor (key) {
    this.key = key;
    this.dataFeature = nimbus.getDataFeaturesService(this.key, 'forecast');
  }

  getWeather(zip, callback) {
    if (!zip) return;
    if (weatherCache[zip]) return callback(weatherCache[zip]);
    this.dataFeature.getDataByZipCodeUS(zip)
      .then(function(data) {
        weatherCache[zip] = data;
        callback(data);
      })
      .catch(function(error) {
        console.log('something bad is caught', error);
      });
  }
}

module.exports = function(key) {
  return new WeatherClient(key);
};