/** Reach out to Weather Underground to get the forecast. */
const nimbus = require('@nnelson/nimbus')();
const dataFeature = nimbus.getDataFeaturesService('<API_KEY>', '<DATAFEATURE>');

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
    this.dataFeature.getDataByZipCodeUS(zip)
      .then(callback)
      .catch(function(error) {
        console.log('something bad is caught', error);
      });
  }
}

module.exports = function(key) {
  return new WeatherClient(key);
};