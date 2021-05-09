import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import tourRouter from "./src/routes/tour";
import userRouter from "./src/routes/user";

import AppError from "./src/helpers/appError";
import ErrorController from "./src/controllers/error";

const app = express();
const globalError = new ErrorController();

dotenv.config();

app.use(express.json());
app.use(express.static(`${__dirname}/public`))

if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`))

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalError.globalErrorHandler)

export default app;