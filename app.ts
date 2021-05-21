import path from "path";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";

import tourRouter from "./src/routes/tour";
import userRouter from "./src/routes/user";
import reviewRouter from "./src/routes/review";
import viewsRouter from "./src/routes/views";

import AppError from "./src/helpers/appError";
import ErrorController from "./src/controllers/error";

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const globalError = new ErrorController();

//Set security HTTP headers
app.use(helmet());

//Request limit
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again in an hour!"
});

app.use("/api", limiter);

//Body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// 3 - ROUTES

app.use("/", viewsRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalError.globalErrorHandler);

export default app;