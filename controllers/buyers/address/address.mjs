import Address from "../../../models/address.mjs";
import Email from "../../../models/emailList.mjs";
import jwt from 'jsonwebtoken';

export const addAddress = async (req, res) => {
    const { address, name, email, city, state, zip: zipCode, country, phone: phoneNumber } = req.body;

    if (!address || !city || !state || !country || !phoneNumber || !email || !name) {
        return res.status(400).json({ error: "All required fields must be provided." });
    }

    if (typeof address !== 'string' || typeof city !== 'string' || typeof state !== 'string' || 
        typeof country !== 'string' || typeof phoneNumber !== 'string' || typeof email !== 'string' || 
        typeof name !== 'string') {
        return res.status(400).json({ error: "Invalid input types provided." });
    }

    const token = req.cookies.token || req.cookies._auth;

    let user
    try {
        if (token) {
            user = jwt.verify(token, process.env.JWT_SECRET)._id;
        }
    } catch (error) {
        return res.status(400).send({ error: "something went wrong" })
    }

    try {
        let addressDoc = await Address.findOneAndUpdate(
            { userId: user },
            {
                address,
                city,
                state,
                zipCode,
                country,
                phoneNumber,
                email,
                name
            },
            { new: true, upsert: true } // Return the updated document, and create if not exists
        );

        if (addressDoc.isNew) {
            await Email.findOneAndUpdate(
                { email },
                { email },
                { upsert: true }
            );
        }

        res.status(201).json({ address: addressDoc });
    } catch (error) {
        res.status(500).json({ error: "Failed to save address." });
    }
};
