import Address from "../../../models/address.mjs";

export const editAddress = async (req, res) => {
    const user = req.user;
    const addressId = req.params.id;
    const { street, city, state, zipCode, country, phoneNumber, countryCode } = req.body;

    try {
        // Find the address by ID and make sure it belongs to the logged-in user
        const address = await Address.findOne({ _id: addressId, userId: user._id });

        if (!address) {
            return res.status(404).json({ error: "Address not found or unauthorized." });
        }

        // Update fields if they are provided
        if (street) address.street = street;
        if (city) address.city = city;
        if (state) address.state = state;
        if (zipCode) address.zipCode = zipCode;
        if (country) address.country = country;
        if (phoneNumber) address.phoneNumber = phoneNumber;
        if (countryCode) address.countryCode = countryCode;

        // Save the updated address
        const updatedAddress = await address.save();
        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(500).json({ error: "Failed to update address"});
    }
};