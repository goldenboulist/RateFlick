import "dotenv/config";
import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { entriesRouter } from "./routes/entries.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

const allowedOrigins = [
  "https://rate-flick.maxime-anterion.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({ status: "RateFlick API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/entries", entriesRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`RateFlick API http://localhost:${port}`);
});
