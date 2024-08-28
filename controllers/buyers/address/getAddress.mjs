import Address from "../../../models/address.mjs";


export const getAddress = async (req, res) => {
    const user = req.user;
    const addressId = req.params.id;

    try {
        // If an address ID is provided, find the specific address
        if (addressId) {
            const address = await Address.findOne({ _id: addressId, userId: user });

            if (!address) {
                return res.status(404).json({ message: "Address not found or unauthorized." });
            }

            return res.status(200).json(address);
        }

        // If no address ID is provided, return all addresses for the user
        const addresses = await Address.find({ userId: user });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve address", error: error.message });
    }
};