import express from 'express'
import route from './views/routes.mjs'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import ExpressMongoSanitize from 'express-mongo-sanitize'

dotenv.config()

const app = express()
app.use(express.json())

// [process.env.FRONTEND || "https://kariaki.vercel.app", "http://localhost:5173"]

const allowedOrigins = 'http://localhost:5173';

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}


app.use(cors(corsOptions))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", allowedOrigins);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
  
app.use(ExpressMongoSanitize())
app.use(cookieParser())
app.use(route)

mongoose.connect(process.env.CONNECT_MONGO)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("runing on port", process.env.PORT)
    })
})

export default app
