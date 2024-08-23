import Review from "../../../models/reviews.mjs";
import Product from "../../../models/products.mjs";

export const getProductReview = async (req, res) => {

    try {
        const { params: { pid: productId  } } = req
        if (!productId) {
            return res.status(400).send({ error: "product Id is required"})
        }
        const product = await Product.find({ _id: productId })

        if (!product) {
            return res.status(400).send({ error: "invalid product id" })
        }
        const review = await Review.find({productId}).populate({
            path: 'userId',
            select: '-password'
          }).exec()
        return res.status(200).send({message: review})
    } catch (err) {
        return res.status(500).send( { error: "server error" })
    }
}