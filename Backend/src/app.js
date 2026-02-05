import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouters from "./routes/auth.routes.js";
import postRouters from "./routes/post.routes.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouters);
app.use("/api/v1/posts", postRouters);

export default app;
