import { Request, Response, NextFunction } from 'express';
import User, { UserBaseDocument } from "../model/user";
import AppError from "../helpers/appError";
import sendEmail from "../helpers/email";

interface RequestBody extends Request {
    body: any
    user? : any
}

export default class AuthController  {

    private catchAsync (fn : Function) {
        return (req : Request, res : Response, next : NextFunction) => {
            fn(req, res, next).catch(next);
        }
    }

    public getAll() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const { email, password } = req.body;

            if(!email || !password) {
                return next(new AppError("Please provide email and password", 400));
            }

            const user = User.findOne({ email });

            const token = '';

            res.status(201).json({
                status: 'success',
                token
            });

        });
    }

    /**
     * name
     */
    public create(req : Request, res : Response, next : NextFunction) {
        res.status(201).json({
            status: 'success',
            message: "This functionallity is not complete yet."
        });
    }

    /**
     * name
     */
    public get(req : Request, res : Response, next : NextFunction) {
        res.status(200).json({
            status: 'success',
            message: "This functionallity is not complete yet."
        });
    }

    /**
     * name
     */
    public update(req : Request, res : Response, next : NextFunction) {
        res.status(201).json({
            status: 'success',
            message: "This functionallity is not complete yet."
        });
    }

    /**
     * name
     */
    public delete(req : Request, res : Response, next : NextFunction) {
        res.status(204).json({
            status: 'success',
            message: "This functionallity is not complete yet."
        });
    }

}