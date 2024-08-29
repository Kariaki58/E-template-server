import Router from "router";
import { home } from "../controllers/index.mjs";
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
import { generateSignature } from "../utils/cloudinary.mjs";
import { productPage } from "../controllers/productPage.mjs";
import { getAddress } from "../controllers/getAddress.mjs";
import { payment } from "../controllers/buyers/payment/payment.mjs";
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
import { Analytics } from "../controllers/sellers/Analytics.mjs";
import { Subscriber } from "../controllers/Subscriber.mjs";


const route = Router()


route.get("/", home)
route.post('/register', register)
route.post('/login', login)
route.post('/signout', signout)
route.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user:req.user })
})

route.get('/upload/products', getUploads)
route.get('/admin/products', authenticateToken, isAdmin, getAllProducts)
route.put('/admin/product/edit', authenticateToken, isAdmin, editProduct);
route.delete('/admin/product/:productId', authenticateToken, isAdmin, deleteProduct);
route.post('/upload/add', authenticateToken, isAdmin, uploadProducts)

route.get('/cart', authenticateToken, getUserCart)
route.post('/cart/add', authenticateToken, addToCart)
route.put('/cart/edit', authenticateToken, editCart)
route.patch('/cart/increment', authenticateToken, incrementCart)
route.patch('/cart/decrement', authenticateToken, decrementCart)
route.delete('/delete/cart/:pos/:cid', authenticateToken, removeFromCart)
route.post('/address/add', addAddress)
route.get('/address', authenticateToken, getAddress)
route.get('/review/get/:pid', getProductReview)
route.post('/review/add', authenticateToken, addReview)
route.put('/review/edit', authenticateToken, editReview)
route.delete('/review/delete', authenticateToken, removeReview)
route.post('/api/gensignature', authenticateToken, isAdmin, generateSignature)
route.post('/payment/transaction', authenticateToken, isAdmin, addTransaction)
route.get('/products/:id', productPage)
route.post('/transaction/initialize', payment)
route.post('/order/place', nonAuthOrder)

route.post('/order', authenticateToken, addOrder);
route.get('/order/user', authenticateToken, getUserOrders);
route.get('/order/admin', authenticateToken, isAdmin, getAllOrders);
route.get('/user/address/:orderId', getUserAddress);
route.patch('/order/admin/:orderId', authenticateToken, isAdmin, modifyOrderStatus)
route.delete('/cart/:id', authenticateToken, clearCart)

route.post('/transaction', authenticateToken, addTransaction);
route.get('/transaction/user', authenticateToken, getUserTransactions);
route.get('/transaction/admin', authenticateToken, isAdmin, getAllTransactions);
route.get('/admin/email', authenticateToken, isAdmin, getUserEmails)

route.get('/api/orders/analytics', authenticateToken, isAdmin, Analytics)
route.post('/make-admin', authenticateToken, Subscriber)

export default route
