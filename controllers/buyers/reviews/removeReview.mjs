import Review from "../../../models/reviews.mjs"

export const removeReview = (req, res) => {
    const userId = req.user
    const { productId } = req.body
    return res.status(200).send({message: "would implement soon"})
}
