const express = require("express");
const router = express.Router();
// const multer = require("multer");
const verifyToken = require("../middleware/auth");
const artworkController = require("../controllers/artwork.controller");

// const { storage } = require("../config/cloudinary"); 
const { upload } = require("../config/cloudinary");

const upload = multer({ storage });

router.get("/", artworkController.getArtworks);
router.get("/:id", artworkController.getArtworkById);
router.get("/artist/:artistId", artworkController.getArtworksByArtist);

router.post("/", verifyToken, upload.single("image"), artworkController.createArtwork); 

router.patch("/:id", verifyToken, artworkController.updateArtwork);
router.delete("/:id", verifyToken, artworkController.deleteArtwork);

module.exports = router;