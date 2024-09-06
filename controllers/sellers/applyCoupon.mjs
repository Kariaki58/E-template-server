import Product from "../../models/products.mjs";
import mongoose from "mongoose";

export const applyCoupon = async (req, res) => {
  try {
    const { coupons } = req.body;

    if (!coupons || coupons.length === 0) {
      return res.status(400).json({ error: "No coupons provided." });
    }
    coupons.map((content) => {
        if (!mongoose.isValidObjectId(content.productId)) {
            return res.status(400).send({ error: "invalid id" })
        }
        if (typeof content.couponCode !== 'string') {
            return res.status(400).send({ error: "couponCode must be a string" })
        }
        try {
            const checking = Number(content.couponPercent)
        } catch (error) {
            return res.status(400).send({ error: "coupon percent must be an integer" })
        }
    })

    const updatePromises = coupons.map(({ productId, couponCode, couponPercent }) => {
      return Product.findByIdAndUpdate(productId, {
        coupon: couponCode,
        couponPercent: Number(couponPercent)
      });
    });

    await Promise.all(updatePromises);

    return res.status(200).json({ message: "Coupons applied successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to apply coupons." });
  }
};
