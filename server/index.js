const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path")

const userRoutes = require("./routes/user.routes");
const artworkRoutes = require("./routes/artwork.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/artworks", artworkRoutes);
app.use("/api/orders", orderRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/artdb")
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch(err => console.log(err));