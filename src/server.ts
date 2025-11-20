/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

/**
 * Custom modules
 */
import config from "@/config";
import limiter from "@/lib/express_rate_limit";

/**
 * Router
 */
import v1Routes from "@/routes/v1";

/**
 * Types
 */
import type { CorsOptions } from "cors";

/**
 * Express app initial
 */
const app = express();

// Configure CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELIST_ORIGINS?.includes(origin)
    ) {
      callback(null, true);
    } else {
      // Reject request from non-whitelisted origins
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false
      );
      console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// `extended: true` allows rich objects and arrays via querystring library
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  })
);

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server
 * - Tries to connect to the database before initializing the server.
 * - Defines the API route (`/api/v1`).
 * - Starts the server on the sepcified PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process exits with status 1
 */

(async () => {
  try {
    app.use("/api/v1", v1Routes);

    app.listen(config.PORT, () => {
      console.log(`Server running: http://localhost:3000 PORT: ${config.PORT}`);
    });
  } catch (err) {
    console.log("Failed to start the server", err);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();
