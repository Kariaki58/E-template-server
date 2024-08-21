import Review from "../../../models/reviews.mjs"


export const addReview = async (req, res) => {
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
    const newReview = new Review({
        productId, rating, comment, reviewImage, reviewVideo
    })

    await newReview.save()

    return res.status(201).send({ message: "thank you for the review" })
}
