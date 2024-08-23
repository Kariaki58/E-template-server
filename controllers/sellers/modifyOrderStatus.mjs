import Order from "../../models/orders.mjs";

export const modifyOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      order.status = status;
      await order.save();
  
      res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (err) {
      res.status(500).json({ error: 'Error updating order status' });
    }
  }