import Address from "../../../models/address.mjs";

export const deleteAddress = async (req, res) => {
    const user = req.user;
    const addressId = req.params.id;

    try {
        const address = await Address.findOneAndDelete({ _id: addressId, userId: user._id });

        if (!address) {
            return res.status(404).json({ error: "Address not found or unauthorized." });
        }

        res.status(200).json({ message: "Address deleted successfully." });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to delete address" });
    }
};