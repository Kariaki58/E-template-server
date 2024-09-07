import Product from "../../models/products.mjs"

export const removeCoupon = async (req, res) => {
    let { couponCode: coupon, couponPercent } = req.body;

    if (!coupon || !couponPercent) {
        return res.status(400).send({ error: "all field are required"})
    }
    if (typeof coupon !== 'string') {
        return res.status(400).send({ error: "coupon code must be a string" })
    }
    try {
        couponPercent = Number(couponPercent)
    } catch(error) {
        return res.status(400).send({ error: "coupon percent must be a number" })
    }

    try {
        const result = await Product.updateMany(
            { coupon, couponPercent: Number(couponPercent) }, 
            { $set: { coupon: '', couponPercent: 0, couponExpiration: null } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send({ error: "No products found with the given coupon" });
        }

        return res.status(200).send({ message: "Coupon removed from products successfully" });
    } catch (error) {
        return res.status(500).send({ error: "Server error" });
    }
}
