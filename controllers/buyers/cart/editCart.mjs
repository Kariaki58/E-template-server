import Cart from "../../../models/carts.mjs"


export const editCart = async (req, res) => {
    const { body: { pos, size, color }} = req
    const _id = req.user
    if (!pos || !size || !color) {
        return res.status(400).send({error: "pos-size-color is required"})
    }
    if (typeof pos !== 'number') {
        return res.status(400).send({error: "pos must be number"})
    }
    if (typeof size !== 'string') {
        return res.status(400).send({error: "size must be a string"})
    }
    if (typeof color !== 'string') {
        return res.status(400).send({ error: "color must be a string"})
    }
    const cart = await Cart.findOne({ userId: _id })
    if (!cart) {
        return res.status(400).send({ error: "no items in cart"})
    }
    if (pos > cart.items.length - 1) {
        return res.status(400).send({error: "invalid position"})
    }
    cart.items[pos].color = color
    cart.items[pos].size = size

    await cart.save()
    return res.status(200).send({message: "changes saved"})
}
