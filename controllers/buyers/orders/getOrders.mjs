import Order from "../../../models/orders.mjs";

export const getOrders = async (req, res) => {
    try {
        // Use lean to speed up query execution by returning plain JavaScript objects
        const MyOrders = await Order.find({})
            .populate('cartId', 'items totalPrice') // Select only relevant fields from the cart
            .populate('shippingAddress', 'address city state zipCode country') // Select only relevant fields from the address
            .lean();

        // Send a 200 response with the orders
        res.status(200).send({ myorders: MyOrders });
    } catch (error) {
        // Handle errors properly by sending a 500 status code with an error message
        res.status(500).send({ error: 'Error fetching orders' });
    }
};
