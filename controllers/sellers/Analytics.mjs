import Order from "../../models/orders.mjs";
export const Analytics = async (req, res) => {
  try {
    // Common aggregation pipeline part
    const commonPipeline = [
      {
        $group: {
          _id: null, // Placeholder for dynamic grouping
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    // Create pipelines for each timeframe by deep-cloning and customizing the commonPipeline
    const dailyOrdersPipeline = JSON.parse(JSON.stringify(commonPipeline));
    dailyOrdersPipeline[0].$group._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };

    const weeklyOrdersPipeline = JSON.parse(JSON.stringify(commonPipeline));
    weeklyOrdersPipeline[0].$group._id = { $dateToString: { format: "%Y-%U", date: "$createdAt" } };

    const monthlyOrdersPipeline = JSON.parse(JSON.stringify(commonPipeline));
    monthlyOrdersPipeline[0].$group._id = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };

    const yearlyOrdersPipeline = JSON.parse(JSON.stringify(commonPipeline));
    yearlyOrdersPipeline[0].$group._id = { $year: "$createdAt" };

    // Execute all aggregations in parallel
    const [dailyOrders, weeklyOrders, monthlyOrders, yearlyOrders] = await Promise.all([
      Order.aggregate(dailyOrdersPipeline),
      Order.aggregate(weeklyOrdersPipeline),
      Order.aggregate(monthlyOrdersPipeline),
      Order.aggregate(yearlyOrdersPipeline)
    ]);

    // Send the result as a JSON response
    res.status(200).json({ dailyOrders, weeklyOrders, monthlyOrders, yearlyOrders });
  } catch (err) {
    res.status(500).send({ error: 'Server Error' });
  }
};

