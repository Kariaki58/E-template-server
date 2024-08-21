import Cart from "../../../models/carts.mjs"

export const getUserCart = async (req, res) => {
    try {
        const user = req.user

        const findUserCart = await Cart.findOne({ userId: user }).populate('items.productId')
        if (!findUserCart) {
            return res.status(200).send({ message: [] })
        }
        return res.status(200).send({ message: findUserCart })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: "server error" })
    }
}