import Address from "../../../models/address.mjs";

export const addAddress = async (req, res) => {
    const user = req.user;

    const { street, city, state, zipCode, country, phoneNumber } = req.body;

    if (!street || !city || !state || !country || !phoneNumber) {
        return res.status(400).json({ error: "All required fields must be provided." });
    }
    if (typeof street !== 'string' || typeof city !== 'string' || typeof state !== 'string' || typeof country !== 'string' || 
        typeof phoneNumber !== 'string' 
    ) {
        return res.status(400).send({error: "error account"})
    }

    const newAddress = new Address({
        userId: user,
        street,
        city,
        state,
        zipCode,
        country,
        phoneNumber,
    });

    try {
        const savedAddress = await newAddress.save();

        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ error: "Failed to save address"});
    }
};
