const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA';

//hardcoded bc we do have google billing account
function getCoordsForAddress(fakeaddressthatdoesnothingbcwehardcoddedorlogandlat) {
  return {
    lat: 40.7484474,
    lng: -73.9871516
  };
}

async function getCoordsForAddress(address) {

  //axios helps send request from node to google servers
  // encodeURIComponent helps take care of white space and sepcial char 
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  //from google geocode; expected error in case we didn't get a response
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    throw error;
  }

  //if everything goes well extract or coordinates 
  const coordinates = data.results[0].geometry.location;

  //return it whenever the fn is called
  return coordinates;
}

module.exports = getCoordsForAddress;
