const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/auth");
const artworkController = require("../controllers/artwork.controller");

// 1. Import the Cloudinary storage you set up
const { storage } = require("../config/cloudinary"); 

// 2. Point multer to Cloudinary instead of diskStorage
const upload = multer({ storage });

router.get("/", artworkController.getArtworks);
router.get("/:id", artworkController.getArtworkById);
router.get("/artist/:artistId", artworkController.getArtworksByArtist);

// 3. This stays the same! Multer handles the magic behind the scenes
router.post("/", verifyToken, upload.single("image"), artworkController.createArtwork); 

router.patch("/:id", verifyToken, artworkController.updateArtwork);
router.delete("/:id", verifyToken, artworkController.deleteArtwork);

module.exports = router;