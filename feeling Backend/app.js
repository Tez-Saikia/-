import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(express.static("public"));

//Routers
import userRouter from './routes/user.router.js';
import adminRouter from './routes/admin.router.js';
import conversationRoutes from "./routes/conversation.routes.js";

app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use("/api/v1/conversations", conversationRoutes);

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});


export default app;