const multer = require('multer');
const uuid = require('uuid');

//the types of files accepted 
//just like "accept" key in the front end
//important bc front end validation can be bypassed for  injection

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

//saving images on the disk
const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid + '.' + ext);
    }
  }),

  //filtering to make sure we get exactly png, jpeg etc, anything is return as undefine
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; 
    let error = isValid ? null : new Error('Invalid mime type!'); //if error exist !! ensures no invalid file get pass our upload
    cb(error, isValid); //forward the error and the validity in the with the call back 
  }
});

module.exports = fileUpload;
