const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

//exporting anonymous fn that takes req, res, and next
//checks if the method is options 
//if so it continues
//our access can fail so we use try catch block
//we attempt to get the token through the header and save it as token
//if the header exits our token will have 
//but it case we don't have it
//we throw an error
//if we do find it we continue to verify the token with the word
//if it successed we add a field or key to or req body called useData and we pass userId of the verification
//we continue execution of the codes
//if the getting and verification fails, we catch the error 
module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') { //will only work with default options request default to all browsers but stops post
    return next(); //stops the options request to allow the post to continue
  }
  try {
    const token = req.headers.Authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN' split at the  empty stirng and make a slist of 2 parts but use the seconde ie [1]
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.userData = { userId: decodedToken.userId }; //adding data in the req with id of the toke
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};
