import Order from "../../models/orders.mjs";


export const Analytics = async (req, res) => {
    try {
      const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      const weeklyOrders = await Order.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%U", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      const monthlyOrders = await Order.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      const yearlyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $year: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      res.json({ dailyOrders, weeklyOrders, monthlyOrders, yearlyOrders });
    } catch (err) {
      res.status(500).send('Server Error');
    }
}