import Review from "../../../models/reviews.mjs";


export const editReview = async (req, res) => {
    try {

        const { body: { productId, rating, comment, reviewImage, reviewVideo }} = req

        if (!rating) {
            return res.status(400).send({ error: "please give us a rating"})
        }
        if (!productId) {
            return res.status(400).send({ error: 'productId is required'})
        }
        if (!comment) {
            return res.status(400).send({ error: "please add a comment" })
        }
        if (reviewImage && reviewVideo) {
            reviewVideo = null
        }
        const findUserReview = await Review.findOne({ productId })
        findUserReview.rating = rating
        findUserReview.comment = comment
        findUserReview.reviewImage = reviewImage
        findUserReview.reviewVideo = reviewVideo

        return res.status(200).send({ message: "thanks for review" })
    } catch (err) {
        return res.status(500).send({ error: "sever error" })
    }
}