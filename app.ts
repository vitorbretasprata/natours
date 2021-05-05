import fs from "fs";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import tourRouter from "./src/routes/tour";
import userRouter from "./src/routes/user";

const app = express();
dotenv.config();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

export default app;