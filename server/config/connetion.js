const mongoose = require("mongoose");

const connetdb = async() => {
    try {
        await mongoose.connect("mongodb+srv://dchauhan2553_db_user:QXt02PpveOEcqsxt@pixelboxcluster.hbtrxzx.mongodb.net/artdb?appName=PixelBoxCluster");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

module.exports = connetdb;