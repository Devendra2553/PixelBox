const express = require("express");
const cors = require("cors");
const path = require("path")

const userRoutes = require("./routes/user.routes");
const artworkRoutes = require("./routes/artwork.routes");
const orderRoutes = require("./routes/order.routes");
const connetdb = require("./config/connetion");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/artworks", artworkRoutes);
app.use("/api/orders", orderRoutes);

connetdb().then( () => {
  console.log("connetions Successfully done!!");
  app.listen(5000 , () => {
    console.log("Server is runing on port 5000");
  })
}).catch((error) => {
  console.log("Connetions failed mongoDb not Conneted" , error.message)
});