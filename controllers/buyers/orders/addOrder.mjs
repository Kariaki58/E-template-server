import Order from "../../../models/orders.mjs"
import Address from "../../../models/address.mjs"

export const addOrder = async (req, res) => {
    const user = req.user

    const { body: { cartId }} = req
    const address = await Address.findOne({ userId: user })
    if (!cartId) {
        return res.status(400).send({ error: "invalid cart id" })
    }
    const order = new Order({
        userId: user,
        cartId: cartId,
        shippingAddress: address._id
    })

    await order.save()
    return res.status(200).send({ message: "thanks for placing an order", order })
}
