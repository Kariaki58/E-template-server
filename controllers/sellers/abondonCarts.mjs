import Cart from "../../models/carts.mjs";

const ABANDONED_CART_THRESHOLD = 30 * 60 * 1000; // 10 minutes

export const abondonCarts = async (req, res) => {
    const now = new Date();
    const threshold = new Date(now.getTime() - ABANDONED_CART_THRESHOLD); // Calculate the threshold date

    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalCarts = await Cart.countDocuments({
            updatedAt: { $lt: threshold },
            'items.0': { $exists: true }
        });

        const abandonedCart = await Cart.find({
            updatedAt: { $lt: threshold },
            'items.0': { $exists: true }
        })
        .skip(skip)
        .limit(limit)
        .populate('userId').select('-password')
        .populate('items.productId');

        res.json({
            totalCarts,
            totalPages: Math.ceil(totalCarts / limit),
            currentPage: page,
            carts: abandonedCart
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch abandoned carts' });
    }
}
