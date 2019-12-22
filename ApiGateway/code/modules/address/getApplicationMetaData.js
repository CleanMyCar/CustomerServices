const mssql = require("mssql");

module.exports = (config, params, callback) => {
  const requestParams = config.dbwrapper.getNewRequest();

  requestParams.execute("GetCountryStateCities", (err, result) => {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }

    let countries = {};

    for (let cIndex = 0; cIndex < result.recordsets[0].length; cIndex++) {
      let country = result.recordsets[0][cIndex];
      countries[country.CountryId] = country;
      countries[country.CountryId].states = {};
    }

    for (let sIndex = 0; sIndex < result.recordsets[1].length; sIndex++) {
      let state = result.recordsets[1][sIndex];
      countries[state.CountryId].states[state.StateId] = state;
      countries[state.CountryId].states[state.StateId].cities = {};
    }

    for (let cityIndex = 0; cityIndex < result.recordsets[2].length; cityIndex++) {
      let city = result.recordsets[2][cityIndex];
      countries[city.CountryId].states[city.StateId].cities[city.CityId] = city;
    }


    return callback(null, countries);
  });
};
