import Product from "../models/products.mjs";

export const productPage = async (req, res) => {
    try {
        const  { id } = req.params

        if (!id) {
            return res.status(400).send({ error: "product id is required" })
        }
        
        const product = await Product.findById(id);
        if (!product) return res.status(404).send({ error: 'Product not found' });
        return res.status(200).send({ message: product });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
}