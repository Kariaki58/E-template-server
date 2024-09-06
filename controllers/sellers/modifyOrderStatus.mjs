import Order from "../../models/orders.mjs";
import mongoose from "mongoose";

export const modifyOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
        return res.status(400).send({ error: "order id is required" })
    }
    if (!status) {
        return res.status(400).send({ erro: "status is required" })
    }
    if (typeof status !== 'string') {
        return res.status(400).send({ error: "status must be a string" })
    }
    if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).send({ error: "not a valid object id" })
    }

    // Validate the status value
    const validStatuses = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }
    
    try {
        // Use findByIdAndUpdate for atomic update
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status } },
            { new: true, runValidators: true } // return updated document and run schema validators
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (err) {
        res.status(500).json({ error: 'Error updating order status' });
    }
};
