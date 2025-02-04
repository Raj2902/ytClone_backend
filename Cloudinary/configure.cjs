// Require the cloudinary library
const cloudinary = require("cloudinary").v2;
//calling my enviroment variables
require("dotenv").config();

const Cloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

module.exports = Cloudinary;
