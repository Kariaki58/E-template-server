import Product from "../../models/products.mjs"

export const applyCouponAndGetDiscount = async(req, res) => {
    const { body: { couponCode } } = req

    try {
        if (!couponCode) {
            return res.status(400).send({ error: "coupon code is required" })
        }
        if (typeof couponCode !== 'string') {
            return res.status(400).send({ error: "coupon code must be a string" })
        }
        const findCoupon = await Product.findOne({ coupon: couponCode })

        if (!findCoupon) {
            return res.status(400).send({ error: "invalid coupon code, please subscribe to newletter to get coupons" })
        }
        return res.status(200).send({ discount: findCoupon.couponPercent })
    } catch (error) {
        return res.status(400).send({ error: "server error" })
    }
}