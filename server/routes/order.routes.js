const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const verifyToken = require("../middleware/auth");


// Protected routes
router.post("/", verifyToken, orderController.createOrder);
router.get("/user/:u_id", verifyToken, orderController.getUserOrders);
router.put("/:orderId", verifyToken, orderController.updateOrder);
router.get("/artist/:artist_id", verifyToken, orderController.getArtistOrders);

router.delete("/:id", orderController.deleteOrder);

// Razorpay routes
router.post("/payment/process", orderController.processPayment)
router.get("/getkey", orderController.getKey)
router.post("/paymentVerification", orderController.paymentVerification)

    
module.exports = router;