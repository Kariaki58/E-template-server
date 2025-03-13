import Order from "../../models/orders.mjs";
import Address from "../../models/address.mjs";
import { sendEmail } from "../Subscriber.mjs";
import { generateEmailTemplate, generateSimpleSellerNotificationTemplate } from "../email-management/emailTemplates.mjs";


export const addNonAuthOrder = async (req, res) => {
    const { cart, shippingDetails, totalAmount } = req.body;

    
    if (!totalAmount) {
        return res.sendStatus(400)
    }
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

    // Validate cart
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).send({ error: "Cart is required and must be a non-empty array" });
    }

    // Validate each item in the cart
    for (const item of cart) {
        if (
            (item.colors && typeof item.colors !== 'string') ||
            (item.sizes && typeof item.sizes !== 'string') ||  
            typeof item.quantity !== 'number' || item.quantity <= 0 ||
            typeof item.price !== 'number' || item.price <= 0
        ) {
            return res.status(400).send({ error: "Each cart item must have a valid (optional) color, (optional) size, quantity, and price." });
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
                productName: item.name,
                color: item.colors,
                size: item.sizes,
                quantity: item.quantity,
                shippingAddress: addressDoc._id,
                price: Number(totalAmount)/100
            });
            await addOrder.save();
        }

        const template = generateEmailTemplate(shippingDetails.name, process.env.ADDRESS)
        const subjectLine = "Thank You for Your Order! 🎉";
        const result = await sendEmail(process.env.ADDRESS, subjectLine, shippingDetails.email, template)

        const notifyTemplateSeller = generateSimpleSellerNotificationTemplate()

        const SellerResult = await sendEmail(process.env.ADDRESS, "Order Alert: A Customer Just Placed an Order!", process.env.ADDRESS, notifyTemplateSeller)
        if ((result && result.error) || (SellerResult && SellerResult.error)) {
            return res.status(500).send({ error: "An unexpected error occured while sending email" })
        }

        return res.status(200).send({ message: "Thank you for placing your order" });
    } catch (error) {
        return res.status(500).send({ error: "Server error", details: error.message });
    }
};
