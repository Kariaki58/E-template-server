import Order from "../../models/orders.mjs";
import mongoose from "mongoose";
import { sendEmail } from "../Subscriber.mjs";
import { generateDeliveredOrderReviewTemplate, trackEmailTemplate, cancelEmailTemplate } from "../email-management/emailTemplates.mjs";

export const modifyOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const {  status, customTemplate  } = req.body;

    if (!orderId) {
        return res.status(400).send({ error: "order id is required" })
    }
    if (!status) {
        return res.status(400).send({ error: "status is required" })
    }
    if (typeof status !== 'string') {
        return res.status(400).send({ error: "status must be a string" })
    }
    if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).send({ error: "not a valid object id" })
    }

    // Validate the status value
    const validStatuses = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }
    
    try {
        // Use findByIdAndUpdate for atomic update
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status } },
            { new: true, runValidators: true } // return updated document and run schema validators
        ).populate('shippingAddress');

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (updatedOrder.status === 'Delivered') {
            const subjectLine = 'Your Order Has Been Delivered! Please Leave Us a Review';
            const reviewEmailTemplate = generateDeliveredOrderReviewTemplate(updatedOrder.shippingAddress.name, updatedOrder._id);
            const reviewEmail = await sendEmail(
                process.env.EMAIL_FROM, 
                subjectLine, 
                updatedOrder.shippingAddress.email, 
                reviewEmailTemplate
            );

            if (reviewEmail && reviewEmail.error) {
                return res.status(400).send({ error: "Could not send review email to customer, contact the developer" });
            }
        } else if (updatedOrder.status === 'Cancelled') {

            if (!customTemplate) {
                return res.status(400).send({ error: "sending an email is required" })
            }
            if (typeof customTemplate !== 'string') {
                return res.status(400).send({ error: "template must be a string" })
            }

            const subjectLine = "Your Order from Apiduct - Cancelled";
            const reviewEmail = await sendEmail(
                process.env.ADDRESS,
                subjectLine,
                updatedOrder.shippingAddress.email,
                customTemplate
            )

            if (reviewEmail && reviewEmail.error) {
                return res.status(400).send({ error: "could not send review email to customer, contact the developer"})
            } else {
                return res.status(200).send({ error: "we've let your customer know!" })
            }

        } else {
            const subjectLine = "Tracking your order from Apiduct";
            const trackOrderEmailTemplate = trackEmailTemplate(updatedOrder.shippingAddress.name, updatedOrder._id, updatedOrder.status);
            const trackOrderEmail = await sendEmail(
                process.env.ADDRESS, 
                subjectLine, 
                updatedOrder.shippingAddress.email, 
                trackOrderEmailTemplate
            );
            console.log(trackOrderEmail)

            if (trackOrderEmail && trackOrderEmail.error) {
                return res.status(400).send({ error: "Could not send tracking email to customer, contact the developer" });
            }
        }
        
        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (err) {
        res.status(500).json({ error: 'Error updating order status' });
    }
};
