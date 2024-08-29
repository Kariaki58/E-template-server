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

const corsOptions = {
    origin: process.env.FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}


app.use(cors(corsOptions))
app.use(ExpressMongoSanitize())
app.use(cookieParser())
app.use(route)

mongoose.connect(process.env.CONNECT_MONGO)
.then(() => {
    app.listen(process.env.PORT, () => {
    })
})

export default app
