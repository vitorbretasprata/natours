import { NextFunction, Request, Response } from 'express';
import AppError from "../helpers/appError";

export default class ErrorController  {

    private handleCastErrorDB (err : { [key: string] : any }) {
        const message = `Invalid ${err.path}: ${err.value}.`;

        return new AppError(message, 400);
    }

    private handleDuplicateFieldsDB (err : { [key: string] : any }) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
        const message = `Duplicate field value: ${value}. Please use another value!`;

        return new AppError(message, 400);
    }

    private handleHandleValidationErrorDB (err : { [key: string] : any }) {
        const errors = Object.values(err.errors).map((el : any) => el.message);

        const message = `Invalid input data: ${errors.join('. ')}`;

        return new AppError(message, 400);
    }

    private sendErrorDev (err : { [key: string] : any }, res : Response) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }

    private sendErrorProd (err : { [key: string] : any }, res : Response) {
        if(err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            console.error("ERROR: ", err);
 
            res.status(500).json({
                status: "error",
                message: "Something went very wrong"
            })
        }
    }

    public globalErrorHandler(err : { [key: string] : any }, req : Request, res : Response, next : NextFunction) {

        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';

        if(process.env.NODE_ENV == "development") {
            this.sendErrorDev(err, res);
        } else if (process.env.NODE_ENV == "production") {
            let error = { ...err }
            if(error.name === "CastError") error = this.handleCastErrorDB(error);
            if(error.code === 11000) error = this.handleDuplicateFieldsDB(error);
            if(error.name === "ValidationError") error = this.handleHandleValidationErrorDB(error);

            this.sendErrorProd(error, res);
        }

    }
}