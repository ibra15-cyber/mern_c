const express = require('express');
const { check, validationResult } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  fileUpload.single('image'), //applying upload image for user signup
  //another validation, we need some required field using express-validator 
  // use validationResult to catch it in the controller 
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() //make capitals to small case
      .isEmail(),       //ther's is an @
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login); //login will fail by default hence we don't need check here

module.exports = router;
