const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path  = require('path');
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  __basedir+"/public/images/auth");
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar'+Date.now()+path.extname(file.originalname));
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});
module.exports = uploadFile;