const Artwork = require('../models/artwork.model');
const { cloudinary } = require("../config/cloudinary");

exports.createArtwork = async (req, res) => {
  try {
    const { u_id, artistName, title, category, price } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload failed or image is missing" });
    }

    const artwork = await Artwork.create({
      u_id,
      artistName, 
      title,
      category,
      price: Number(price),
      imageUrl: req.file.path 
    });

    res.status(201).json(artwork);
  } catch (error) {
    console.error("Runtime Error:", error); 
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find().populate("u_id", "name").sort({ createdAt: -1 });
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching artworks", error: error.message });
  }
};

exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });
    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({ message: "Error fetching artwork", error: error.message });
  }
};

exports.updateArtwork = async (req, res) => {
  try {
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    
    if (!updatedArtwork) return res.status(404).json({ message: "Artwork not found" });
    res.status(200).json(updatedArtwork);
  } catch (error) {
    res.status(500).json({ message: "Error updating artwork", error: error.message });
  }
};

exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    // Extract public_id from Cloudinary URL to delete it from the cloud
    // This logic gets 'pixelbox_uploads/filename' from the URL
    const publicId = artwork.imageUrl.split('/').slice(-2).join('/').split('.')[0];
    
    await cloudinary.uploader.destroy(publicId);

    // Delete the document from MongoDB
    await Artwork.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Artwork and cloud image deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Error deleting artwork", error: error.message });
  }
};

exports.getArtworksByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    const artworks = await Artwork.find({ u_id: artistId }).sort({ createdAt: -1 });
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching artist artworks", error: error.message });
  }
};

