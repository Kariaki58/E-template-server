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

    let findAddress = await Address.findOne({ userId: user })

    if (findAddress) {
        findAddress.street = street
        findAddress.city = city
        findAddress.state = state
        findAddress.zipCode = zipCode
        findAddress.phoneNumber = phoneNumber
        findAddress.country = country
    } else {

        findAddress = new Address({
            userId: user,
            street,
            city,
            state,
            zipCode,
            country,
            phoneNumber,
        });
    }


    try {
        const savedAddress = await findAddress.save();

        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ error: "Failed to save address"});
    }
};
