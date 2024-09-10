import Product from "../../models/products.mjs";
import Order from "../../models/orders.mjs";
import Email from "../../models/emailList.mjs";

export const getTotal = async (req, res) => {
  try {
    // Fetch total count for each model
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const totalEmails = await Email.countDocuments({});

    // Send the totals as a response
    res.json({
      totalProducts,
      totalOrders,
      totalEmails
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
