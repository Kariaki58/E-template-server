import Cart from "../../../models/carts.mjs"


export const clearCart = async (req, res) => {
    try {
        const { id } = req.params

        await Cart.findByIdAndDelete(id)
        return res.status(200).send({ message: [] })
    } catch (error) {
        return res.status(500).send({ error: "server error" })
    }
}