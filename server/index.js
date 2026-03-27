const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

const userRoutes = require("./routes/user.routes.js");
const artworkRoutes = require("./routes/artwork.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const payment = require("./routes/order.routes");
const connetdb = require("./config/connetion");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", payment);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/artworks", artworkRoutes);
app.use("/api/orders", orderRoutes);

connetdb().then(() => {
  console.log("connetions Successfully done!!");
  app.listen(5000, () => {
    console.log("Server is runing on port 5000");
  })
}).catch((error) => {
  console.log("Connetions failed mongoDb not Conneted", error.message)
});