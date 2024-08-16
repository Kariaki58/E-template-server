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


const route = Router()

route.get("/", home)
route.post('/register', register)
route.post('/login', login)
route.post('/signout', signout)
route.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user:req.user })
})
route.post('/upload/product', authenticateToken, isAdmin, uploadProducts)
route.put('/upload/product', authenticateToken, isAdmin, editProduct)
route.delete('/upload/product', authenticateToken, isAdmin, deleteProduct);


export default route
