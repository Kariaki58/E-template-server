import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';  // Security headers
import compression from 'compression';  // Response compression
import rateLimit from 'express-rate-limit';  // Rate limiting
import routes from './views/routes.mjs';

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json({ limit: '10kb' }));  // Limit request body size to prevent attacks
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(compression());  // Compress responses
app.use(helmet());  // Set security-related HTTP response headers

// CORS configuration
const allowedOrigins = 'https://apiduct.vercel.app'
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 60 * 1000, // 15 hours
    max: 1000, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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

// Connect to MongoDB and start server
mongoose
  .connect(process.env.CONNECT_MONGO_LOCAL, {
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
    });
  })
  .catch(err => {
  });

export default app;
