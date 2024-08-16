import Cart from "../../../models/carts.mjs"

export const getUserCart = async (req, res) => {
    try {
        const user = req.user

        const findUserCart = await Cart.findOne({ userId: user })

        if (!findUserCart) {
            return res.status(200).send({ message: [] })
        }
        return res.status(200).send({ message: findUserCart.items })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: "server error" })
    }
}