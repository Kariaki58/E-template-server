import Router from "router";
import Product from "../models/products.mjs"
import { register } from "../controllers/authentication/register.mjs";
import { login } from "../controllers/authentication/login.mjs";
import { authenticateToken } from "../middleware/auth.mjs";
import {uploadProducts} from '../controllers/sellers/upload-products.mjs'
import { isAdmin } from "../middleware/isAdmin.mjs";
import { signout } from "../controllers/authentication/signout.mjs";
import { getUploads } from "../controllers/sellers/getUploads.mjs";
import { addToCart } from "../controllers/buyers/cart/addToCart.mjs";
import { removeFromCart } from "../controllers/buyers/cart/deleteFromCart.mjs";
import { incrementCart } from "../controllers/buyers/cart/incrementCart.mjs";
import { getUserCart } from "../controllers/buyers/cart/carts.mjs";
import { decrementCart } from "../controllers/buyers/cart/decrementCart.mjs";
import { editCart } from "../controllers/buyers/cart/editCart.mjs";
import { addAddress } from "../controllers/buyers/address/address.mjs";
import { addOrder } from "../controllers/buyers/orders/addOrder.mjs";
import { getProductReview } from "../controllers/buyers/reviews/getReview.mjs";
import { addReview } from "../controllers/buyers/reviews/addReview.mjs";
import { editReview } from "../controllers/buyers/reviews/editReview.mjs";
import { removeReview } from "../controllers/buyers/reviews/removeReview.mjs";
import { productPage } from "../controllers/productPage.mjs";
import { getAddress } from "../controllers/getAddress.mjs";
import { generateSignature } from "../utils/cloudinary.mjs";
import { addTransaction } from '../controllers/sellers/transactions.mjs';
import { getUserOrders, getAllOrders } from "../controllers/buyers/orders/addOrder.mjs";
import { getUserTransactions, getAllTransactions } from "../controllers/sellers/transactions.mjs";
import { modifyOrderStatus } from "../controllers/sellers/modifyOrderStatus.mjs";
import { getUserAddress } from "../controllers/buyers/orders/addOrder.mjs";
import { getUserEmails } from '../controllers/sellers/getUserEmails.mjs'
import { getAllProducts, deleteProduct } from "../controllers/sellers/deleteProduct.mjs";
import { editProduct } from "../controllers/sellers/editProduct.mjs";
import { nonAuthOrder } from "../controllers/buyers/orders/nonAuthOrder.mjs";
import { clearCart } from "../controllers/buyers/cart/clearCart.mjs";
import { Subscriber } from "../controllers/Subscriber.mjs";
import { emailAutomate } from "../controllers/email-management/email.mjs";
import { SubscribeToNewsLetter, UnsubscribeEndpoint } from "../controllers/email-management/SubscribeToNewsLetter.mjs";
import { addNonAuthOrder } from "../controllers/sellers/addNonAuthOrder.mjs";
import { applyCoupon } from "../controllers/sellers/applyCoupon.mjs";
import { removeCoupon } from "../controllers/sellers/removeCoupon.mjs";
import { applyCouponAndGetDiscount } from "../controllers/sellers/applyCouponAndGetDiscount.mjs";
import { sendEmailToCustomer } from "../controllers/email-management/sendEmailToCustomer.mjs";
import { orderPerDayData, orderPerMonthData, orderPerWeekData, orderPerYearData } from "../controllers/analytics/TotalOrders.mjs";
import { getTotal } from "../controllers/analytics/getTotal.mjs";
import { upload } from "../utils/cloudinary.mjs";
import { getAdminContent, getSettings, getAppLayout } from "../controllers/sellers/Content.mjs";
import { removeFromCloudinary } from "../utils/cloudinary.mjs";
import { getAllCategory } from "../controllers/getAllCategory.mjs";
import { trackOrder } from "../controllers/buyers/trackOrder.mjs";


const route = Router()

route.get('/', getUploads)

route.post('/register', register)
route.post('/login', login)
route.post('/signout', signout)

route.get('/admin/products', authenticateToken, isAdmin, getAllProducts)
route.put('/admin/product/edit', authenticateToken, isAdmin, editProduct);
route.delete('/admin/product/:productId', authenticateToken, isAdmin, deleteProduct);
route.post('/upload/add', authenticateToken, isAdmin, upload.array('images'), uploadProducts)
route.get("/category", getAllCategory)

route.get("/api/track-order", trackOrder)
route.get('/cart', authenticateToken, getUserCart)
route.post('/cart/add', authenticateToken, addToCart)
route.put('/cart/edit', authenticateToken, editCart)
route.patch('/cart/increment', authenticateToken, incrementCart)
route.patch('/cart/decrement', authenticateToken, decrementCart)
route.delete('/delete/cart/:pos/:cid', authenticateToken, removeFromCart)
route.post('/api/gensignature', authenticateToken, isAdmin, generateSignature)
route.post('/address/add', addAddress)
route.get('/address', authenticateToken, getAddress)
route.get('/review/get/:pid', getProductReview)
route.post('/review/add', authenticateToken, addReview)
route.put('/review/edit', authenticateToken, editReview)
route.delete('/review/delete', authenticateToken, removeReview)
route.get('/products/:slug', productPage)
route.post('/order/place', nonAuthOrder)

route.post('/order', authenticateToken, addOrder);
route.post('/order/add', addNonAuthOrder)
route.get('/order/user', authenticateToken, getUserOrders);
route.get('/order/admin', authenticateToken, isAdmin, getAllOrders);
route.get('/user/address/:orderId', getUserAddress);
route.patch('/order/admin/:orderId', authenticateToken, isAdmin, modifyOrderStatus)
route.delete('/cart/:id', authenticateToken, clearCart)

route.post('/transaction', authenticateToken, addTransaction);
route.get('/transaction/user', authenticateToken, getUserTransactions);
route.get('/transaction/admin', authenticateToken, isAdmin, getAllTransactions);
route.get('/admin/email', authenticateToken, isAdmin, getUserEmails)

route.post('/make-admin', authenticateToken, Subscriber)

route.post('/send/email', emailAutomate)
route.post('/newsletter', SubscribeToNewsLetter)
route.get('/unsubscribe/:token', UnsubscribeEndpoint)

route.post('/admin/coupons', authenticateToken, isAdmin, applyCoupon)
route.post('/admin/coupons/delete', authenticateToken, isAdmin, removeCoupon)
route.post('/apply-coupon', applyCouponAndGetDiscount)
route.post('/admin/send-email', authenticateToken, isAdmin, sendEmailToCustomer)

route.get('/orders/day', authenticateToken, isAdmin, orderPerDayData)
route.get('/orders/month', authenticateToken, isAdmin, orderPerMonthData)
route.get('/orders/year', authenticateToken, isAdmin, orderPerYearData)

route.get('/total/data', authenticateToken, isAdmin, getTotal)

route.post('/admin/content', authenticateToken, isAdmin, getAdminContent)
route.get('/admin/content', authenticateToken, isAdmin, getSettings)
route.get('/admin/layout', getAppLayout)

route.get("/api/all", async (req, res) => {
    const products = await Product.find({});
    res.send(products);
})

route.delete('/admin/:productId/delete', authenticateToken, isAdmin, async (req, res) => {
    const { imageUrl } = req.query;
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).send({ error: "Product ID is required" });
    }

    if (!imageUrl) {
        return res.status(400).send({ error: "Image URL is required" });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Filter out the image to be removed
        const updatedImages = product.images.filter(img => img.trim() !== imageUrl.trim());



        // Update the product's images array in MongoDB
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { images: updatedImages },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(500).send({ error: "Failed to update product images" });
        }

        // Call Cloudinary to remove the image
        const result = await removeFromCloudinary(imageUrl);
        if (result.result !== 'ok') {
            return res.status(500).send({ error: "Failed to remove image from Cloudinary" });
        }

        return res.status(200).send({ message: "Image removed successfully", product: updatedProduct });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});



export default route
