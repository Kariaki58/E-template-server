import Address from "../../../models/address.mjs";
import Email from "../../../models/emailList.mjs";
import jwt from 'jsonwebtoken'

export const addAddress = async (req, res) => {
    const { address, name, email, city, state, zip: zipCode, country, phone: phoneNumber } = req.body;
    const token = req.cookies.token || req.cookies._auth
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        req.user = user._id
    })
    
    const user = req.user
    if (!address || !city || !state || !country || !phoneNumber || !email || !name) {
        return res.status(400).json({ error: "All required fields must be provided." });
    }

    if (typeof address !== 'string' || typeof city !== 'string' || typeof state !== 'string' || 
        typeof country !== 'string' || typeof phoneNumber !== 'string' || typeof email !== 'string' || 
        typeof name !== 'string') {
        return res.status(400).json({ error: "Invalid input types provided." });
    }

    try {
        let findAddress = await Address.findOne({ userId: user });
        if (findAddress) {
            findAddress.userId = user,
            findAddress.address = address;
            findAddress.city = city;
            findAddress.state = state;
            findAddress.zipCode = zipCode;
            findAddress.country = country;
            findAddress.phoneNumber = phoneNumber;
            findAddress.email = email;
            findAddress.name = name;
        } else {
            findAddress = new Address({
                userId: user,
                address,
                city,
                state,
                zipCode,
                country,
                phoneNumber,
                email,
                name
            });
            const savedEmail = new Email({
                email
            })
            await savedEmail.save()
        }

        const savedAddress = await findAddress.save();

        res.status(201).send({ address: savedAddress });
    } catch (error) {
        res.status(500).json({ error: "Failed to save address." });
    }
};
