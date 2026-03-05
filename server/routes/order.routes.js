const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.post("/", orderController.createOrder);
router.get("/user/:u_id", orderController.getUserOrders);
router.put("/:orderId", orderController.updateOrder);
router.get("/artist/:artist_id", orderController.getArtistOrders);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;