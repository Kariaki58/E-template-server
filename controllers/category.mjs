import Category from "../models/categories.mjs"

export const category = async (req, res) => {
    const categories = await Category.find({})

    return res.status(200).send({ message: categories })
}
