const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const artworkController = require("../controllers/artwork.controller");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), artworkController.createArtwork);
router.get("/", artworkController.getArtworks);
router.get("/:id", artworkController.getArtworkById);
router.patch("/:id", artworkController.updateArtwork);
router.delete("/:id", artworkController.deleteArtwork);
router.get("/artist/:artistId", artworkController.getArtworksByArtist);

module.exports = router;