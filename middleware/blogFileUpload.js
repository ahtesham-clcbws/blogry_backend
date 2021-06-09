const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path  = require('path');
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  __basedir+"/public/images/blogs");
  },
  filename: (req, file, cb) => {
    cb(null, 'blogs'+Date.now()+path.extname(file.originalname));
  },
});

let blogFileUpload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});
module.exports = blogFileUpload;