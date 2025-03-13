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
app.use(express.json({ limit: '20MB' }));  // Limit request body size to prevent attacks
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(compression());  // Compress responses
app.use(helmet());  // Set security-related HTTP response headers

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else {
      callback(null, origin);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // Required for cookies/auth headers
};

app.use(cors(corsOptions));

app.set('trust proxy', 1);


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


// Use routes
app.use(routes);


mongoose
  .connect(process.env.CONNECT_MONGO, {
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
  });

export default app;
