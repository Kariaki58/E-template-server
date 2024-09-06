import Order from "../../models/orders.mjs"
import Address from "../../models/address.mjs"

export const addNonAuthOrder = async (req, res) => {
    
    const { cart, shippingDetails, status } = req.body
    // validate request
    try {
        let addressDoc = await Address.findOneAndUpdate(
            { email: shippingDetails.email },
            {
                name: shippingDetails.name,
                city: shippingDetails.city,
                address: shippingDetails.address,
                state: shippingDetails.state,
                zipCode: shippingDetails.zip,
                country: shippingDetails.country,
                phoneNumber: shippingDetails.phone,
                email: shippingDetails.email
            },
            { new: true, upsert: true } // Return the updated document, and create if not exists
        );
        await addressDoc.save()
        cart.forEach(async (other) => {
            const addOrder = new Order({
                color: other.color,
                size: other.size,
                quantity: other.quantity,
                shippingAddress: addressDoc._id,
                price: other.price,
                status: status === 'success' ? 'Paid' : 'Pending'
            })
            await addOrder.save()
        });

        return res.status(200).send({ message: "thanks for placing your order" })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: "server error" })
    }
}