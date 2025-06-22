import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import { dev, port } from "./utils/helpers";
import { OK, INTERNAL_SERVER_ERROR } from "./utils/http-status";
import { connectDB, deleteAllCollections } from "./config/db";
import { AppError } from "./utils/error";
import authRoutes from "./routes/auth.routes";
import weatherRoutes from "./routes/weather.routes";
import historyRoutes from "./routes/history.routes";

// // Delete all collections
// deleteAllCollections();

// Connect to MongoDB
connectDB();

const app: Express = express();

// Middleware
app.use(
  cors({
    origin: dev ? 'http://localhost:5173' : 'https://weatherhubui.onrender.com',

    credentials: true,
  })
);

app.use(helmet());
app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Authentication workflow:
  1) After a post request go to the specified endpoint e.g. /api/auth/signup.
  2) Call the function from the controller, where it destructures the body then inputs the credentials in another sign up function from the services.
  3) This function checks for an existing email, create a user in the db, generates tokens and return a promise of a user accessToken and a refreshToken.
  4) The controller (signup function) will await and destructure the output then store tokens to the cookies with protection ( httpOnly: true, secure:!dev).
  5) Finally, send a success response to the user with json containing the data except the password.
*/

// Routes
app.use("/auth", authRoutes);
app.use(weatherRoutes);
app.use(historyRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.status(OK).json({ message: "This is weatherHubAPI - Welcome!" });
});

// Error handling middleware
app.use(
  (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    logger.error("Error:", err.message);

    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(dev && { stack: err.stack }),
      });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went wrong!",
      ...(dev && { error: err.message, stack: err.stack }),
    });
  }
);

// Start server
app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${port}`);
});
