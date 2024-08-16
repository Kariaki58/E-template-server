import Order from "../../../models/orders.mjs"

export const getOrders = async (req, res) => {
    const MyOrders = await Order.find({}).populate('cartId').populate('shippingAddress')

    return res.status(200).send({ myorders: MyOrders })
}