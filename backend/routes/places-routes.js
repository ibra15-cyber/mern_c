const express = require('express');
const { check, validationResult } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');

const fileUpload = require('../middleware/file-upload'); //importing our fileupload logic

const checkAuth = require('../middleware/check-auth'); //check token import

const router = express.Router();



router.get('/:pid', placesControllers.getPlaceByPlaceId);

router.get('/user/:uid', placesControllers.getPlacesByUserId);


router.use(checkAuth); //here because the two initila routes should be available for anyone
//this stops any incoming request for invalid token ie the token we generated with jwt and sending to the fornt end

router.post(
  '/',
  fileUpload.single('image'), //expecting images from places
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  placesControllers.createPlace
);

//no clash with get /:pid becasue this is patch
router.patch(
  '/:pid',
  // check and its altervative in the controller validationResult to enformce some fields 
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
