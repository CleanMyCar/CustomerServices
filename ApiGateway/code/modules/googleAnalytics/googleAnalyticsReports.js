const request = require('request-promise');
const  google  = require('googleapis');
const reporting = google.analyticsreporting('v4');

const view_id = '196376939'

module.exports = (config, params, callback) => {
  console.log("config", config);
  const jwtClient = new google.auth.JWT(config.googleAnalyticsJwt.CLIENT_EMAIL, null, config.googleAnalyticsJwt.PRIVATE_KEY, 'https://www.googleapis.com/auth/analytics.readonly', null)
   


  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      return;
    }
    let analytics = google.analytics('v3');
    queryData(analytics);
  });

  function queryData(analytics) {
    analytics.data.ga.get({
      'auth': jwtClient,
      'ids': 'ga:' + view_id,
      'metrics': params.metrics,
      'dimensions': 'ga:date',
      'start-date': params.startDate,
      'end-date': params.endDate,
      
      // 'sort': '-ga:uniquePageviews',
      // 'max-results': 10,
      // 'filters': 'ga:pagePath=~/ch_[-a-z0-9]+[.]html$',
    }, function (err, response) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(JSON.stringify(response, null, 4));
      callback(null, response);
    });  
  } 
    
}





