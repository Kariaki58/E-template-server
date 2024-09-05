import Order from "../../models/orders.mjs";

export const modifyOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

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
