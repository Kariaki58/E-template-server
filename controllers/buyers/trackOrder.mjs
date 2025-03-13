import Order from "../../models/orders.mjs";
import mongoose from 'mongoose';


export const trackOrder = async(req, res) => {
    const { trackingNumber } = req.query;

    if (!trackingNumber) {
        return res.status(400).send({ error: "Order ID is required" });
    }
    if (!mongoose.isValidObjectId(trackingNumber)) {
        return res.status(400).send({ error: "Invalid order ID" });
    }
    try {
        let status = 0;
        const order = await Order.findById(trackingNumber);
        if (!order) {
            return res.status(404).send({ error: "Order not found" });
        }
        if (order.status === "Pending") {
            status = 0;
        }
        if (order.status === "Paid") {
            status = 1;
        }
        if (order.status === "Shipped") {
            status = 2;
        }
        if (order.status === "Delivered") {
            status = 3;
        }
        if (order.status === "Cancelled") {
            status = 4;
        }
        const orderDetails = {
            productName: order.productName,
            quantity: order.quantity,
            price: order.price,
            status
        };

        res.status(200).send({ orderDetails });
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
}