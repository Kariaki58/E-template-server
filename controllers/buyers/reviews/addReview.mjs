import Review from "../../../models/reviews.mjs"


export const addReview = async (req, res) => {
    const { body: { productId, rating, comment, imageUrl: reviewImage }} = req
    const user = req.user

    const checkUserReview = await Review.findOne({ userId: user, productId })
    if (checkUserReview) {
        return res.status(200).send({ message: "you already given a review for this product "})
    }
    if (!rating) {
        return res.status(400).send({ error: "please give us a rating"})
    }
    if (!productId) {
        return res.status(400).send({ error: 'productId is required'})
    }
    if (!comment) {
        return res.status(400).send({ error: "please add a comment" })
    }
    const newReview = new Review({
        userId: user, productId, rating, comment, reviewImage
    })
    await newReview.save()
    return res.status(201).send({ message: "thank you for the review" })
}
