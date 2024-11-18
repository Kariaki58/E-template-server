import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './views/routes.mjs';

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json({ limit: '100kb' }));  // Limit request body size to prevent attacks
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(compression());  // Compress responses
app.use(helmet());  // Set security-related HTTP response headers

// CORS configuration
const allowedOrigins = process.env.FRONTEND
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      return res.status(429).json({
        message: "Too many requests, please try again later."
      });
    }
});
app.use(limiter);

// Prevent XSS attacks
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('Referrer-Policy', 'no-referrer');
  next();
});

// Use routes
app.use(routes);


mongoose
  .connect(process.env.CONNECT_MONGO, {
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("running...")
    });
  })
  .catch(err => {
  });

export default app;
