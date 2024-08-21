import Router from "router";
import { home } from "../controllers/index.mjs";
import { register } from "../controllers/authentication/register.mjs";
import { login } from "../controllers/authentication/login.mjs";
import { authenticateToken } from "../middleware/auth.mjs";
import {uploadProducts} from '../controllers/sellers/upload-products.mjs'
import { isAdmin } from "../middleware/isAdmin.mjs";
import { editProduct } from "../controllers/sellers/editProduct.mjs";
import { deleteProduct } from '../controllers/sellers/deleteProduct.mjs';
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
import { getOrders } from "../controllers/buyers/orders/getOrders.mjs";
import { getProductReview } from "../controllers/buyers/reviews/getReview.mjs";
import { addReview } from "../controllers/buyers/reviews/addReview.mjs";
import { editReview } from "../controllers/buyers/reviews/editReview.mjs";
import { removeReview } from "../controllers/buyers/reviews/removeReview.mjs";
import { category } from "../controllers/category.mjs";
import { generateSignature } from "../utils/cloudinary.mjs";


const route = Router()


route.get("/", home)
route.post('/register', register)
route.post('/login', login)
route.post('/signout', signout)
route.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user:req.user })
})

route.get('/upload/product', getUploads)
route.post('/upload/add', authenticateToken, isAdmin, uploadProducts)
route.put('/upload/edit', authenticateToken, isAdmin, editProduct)
route.delete('/upload/delete', authenticateToken, isAdmin, deleteProduct);

route.get('/cart', authenticateToken, getUserCart)
route.post('/cart/add', authenticateToken, addToCart)
route.put('/cart/edit', authenticateToken, editCart)
route.patch('/cart/increment', authenticateToken, incrementCart)
route.patch('/cart/decrement', authenticateToken, decrementCart)
route.delete('/delete/cart/:pos/:cid', authenticateToken, removeFromCart)
route.post('/address/add', authenticateToken, addAddress)
route.post('/order/add', authenticateToken, addOrder)
route.get('/order/get', authenticateToken, getOrders)
route.get('/category/get', category)
route.get('/review/get', getProductReview)
route.post('/review/add', addReview)
route.put('/review/edit', editReview)
route.delete('/review/delete', removeReview)
route.post('/api/gensignature', authenticateToken, isAdmin, generateSignature)

export default route
