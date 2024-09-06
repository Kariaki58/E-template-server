import Address from "../../../models/address.mjs";
import mongoose from "mongoose";


export const getAddress = async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.id;

    if (!mongoose.isValidObjectId(addressId)) {
        return res.status(400).send({ error: "not a valid id" })
    }
    try {
        if (addressId) {
            if (!mongoose.Types.ObjectId.isValid(addressId)) {
                return res.status(400).json({ error: "Invalid address ID format." });
            }

            const address = await Address.findOne({ _id: addressId, userId }).exec();

            if (!address) {
                return res.status(200).json({ message: [] });
            }

            return res.status(200).json(address);
        }

        const addresses = await Address.find({ userId }).exec();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve addresses." });
    }
};