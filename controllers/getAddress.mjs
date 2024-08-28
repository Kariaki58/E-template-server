import Address from "../models/address.mjs"

export const getAddress = async (req, res) => {
    const userId = req.user
    const findUserAddress = await Address.findOne({ userId })
    if (!findUserAddress) {
        return res.status(400).send({ error: "you are not authenticated" })
    }
    return res.status(200).send({ message: findUserAddress })
}