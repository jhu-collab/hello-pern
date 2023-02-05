import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import { globalErrorHandler } from "./util/middleware.js";
import { factory } from "./util/debug.js";

const debug = factory(import.meta.url);
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));

app.get("/", (req, res) => {
  debug(`${req.method} ${req.path} called...`);
  res.send("API Server!");
  debug(`done with ${req.method} ${req.path}`);
});

// Routing (API endpoints)
app.use("/", auth);
app.use("/api", users);

app.use(globalErrorHandler);

export default app;
