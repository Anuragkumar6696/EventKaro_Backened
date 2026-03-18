const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "eventkaro",
      format: file.mimetype.split("/")[1]   // ⭐ VERY IMPORTANT
    };
  }
});

const upload = multer({ storage });

module.exports = upload;