import Address from "../../../models/address.mjs";


export const editAddress = async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.id;
    const { address, city, state, zipCode, country, phoneNumber } = req.body;

    if (!addressId) {
        return res.status(400).json({ error: "Address ID is required." });
    }

    if (!address || !city || !state || !country || !phoneNumber) {
        return res.status(400).json({ error: "All required fields must be provided." });
    }

    try {
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, userId: userId },
            { address, city, state, zipCode, country, phoneNumber },
            { new: true, runValidators: true } // Return updated document and run validators
        ).exec();

        if (!updatedAddress) {
            return res.status(404).json({ error: "Address not found or unauthorized." });
        }

        res.status(200).json(updatedAddress);
    } catch (error) {
        console.error("Error in editAddress endpoint:", error);
        res.status(500).json({ error: "Failed to update address." });
    }
};