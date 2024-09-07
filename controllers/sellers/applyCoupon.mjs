import Product from "../../models/products.mjs";
import mongoose from "mongoose";


function isValidISODateString(isoDateString) {
  // Regular expression to match ISO 8601 date format
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  // Test the string against the regex
  if (!iso8601Regex.test(isoDateString)) {
    return false;
  }

  // Further validation by creating a Date object
  const date = new Date(isoDateString);
  
  // Check if the date is valid (i.e., not 'Invalid Date')
  return date.toString() !== 'Invalid Date';
}



export const applyCoupon = async (req, res) => {
  try {
    const { coupons, date } = req.body;

    if (!coupons || coupons.length === 0) {
      return res.status(400).json({ error: "No coupons provided." });
    }
    if (!date) {
      return res.status(400).send({ error: "date is required" })
    }

    if (!isValidISODateString(date)) {
      return res.status(400).send({ error: "not a valid date" })
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
            if (checking <= 0) {
              return res.status(400).send({ error: "coupon must be greater than zero"})
            }
        } catch (error) {
            return res.status(400).send({ error: "coupon percent must be an integer" })
        }
    })
    const expirationDate = new Date(date);

    const updatePromises = coupons.map(({ productId, couponCode, couponPercent }) => {
      return Product.findByIdAndUpdate(productId, {
        coupon: couponCode,
        couponPercent: Number(couponPercent),
        couponExpiration: expirationDate
      });
    });

    await Promise.all(updatePromises);

    return res.status(200).json({ message: "Coupons applied successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to apply coupons." });
  }
};
