import Order from "../../models/orders.mjs";
import Address from "../../models/address.mjs";

export const addNonAuthOrder = async (req, res) => {
    const { cart, shippingDetails, status } = req.body;
    
    // Validate shipping details
    if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.state  ||
        !shippingDetails.country || !shippingDetails.phone || !shippingDetails.email || !shippingDetails.name
    ) {
        return res.status(400).send({ error: "All input fields are required" });
    }

    Object.values(shippingDetails).forEach(value => {
        if (typeof value !== 'string') {
            throw new Error('All input must be strings');
        }
    });

    // Validate status
    if (!status) {
        return res.status(400).send({ error: "Status is required" });
    }

    // Validate cart
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).send({ error: "Cart is required and must be a non-empty array" });
    }

    // Validate each item in the cart
    for (const item of cart) {
        if (
            !item.color || typeof item.color !== 'string' ||
            !item.size || typeof item.size !== 'string' ||
            !item.quantity || typeof item.quantity !== 'number' ||
            !item.price || typeof item.price !== 'number'
        ) {
            return res.status(400).send({ error: "Each cart item must have valid color, size, quantity, and price" });
        }
    }

    try {
        // Create or update the address in the database
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
            { new: true, upsert: true }
        );

        await addressDoc.save();

        // Save each order from the cart
        for (const item of cart) {
            const addOrder = new Order({
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                shippingAddress: addressDoc._id,
                price: item.price,
                status: status === 'success' ? 'Paid' : 'Pending'
            });
            await addOrder.save();
        }

        return res.status(200).send({ message: "Thank you for placing your order" });
    } catch (error) {
        return res.status(500).send({ error: "Server error", details: error.message });
    }
};
