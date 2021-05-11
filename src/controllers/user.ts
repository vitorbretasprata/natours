import { promisify } from "util";
import { Request, Response, NextFunction } from 'express';
import User, { UserBaseDocument } from "../model/user";
import jwt from "jsonwebtoken";
import AppError from "../helpers/appError";

interface RequestBody extends Request {
    user? : any
}

export default class UserController  {

    private catchAsync (fn : Function) {
        return (req : Request, res : Response, next : NextFunction) => {
            fn(req, res, next).catch(next);
        }
    }

    private signToken (id : string) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        })
    }

    /**
     * name
     */
     public restrictTo(...roles : Array<string>) {
        return (req : RequestBody, res : Response, next : NextFunction) => {
            if(!roles.includes(req.user.role)) {
                return next(new AppError("You do not have permission to perform this action", 403));
            }
        }
    }

    /**
     * name
     */
    public protect() {
        this.catchAsync(async (req : RequestBody, res : Response, next : NextFunction) => {
            let token;
            if(
                req.headers.authorization && 
                req.headers.authorization.startsWith("Bearer")
            ) {
                token = req.headers.authorization.split(' ')[1];
            }

            if(!token) {
                return next(new AppError("You are not logged in! Please log in to get access", 401));
            }

            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            const freshUser : UserBaseDocument = await User.findById(decoded.id);

            if(!freshUser) {
                return next(new AppError('The user beloging to this token does not longer exist', 401));
            }

            if(freshUser.changedPasswordAfter(decoded.iat)) {
                return next(
                    new AppError('User recently changed password! Pleade log in again.', 401)
                );
            }

            req.user = freshUser;
            next();
        });
    }


    /**
     * name
     */
    public signUp() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const newUser = await User.create(req.body);

            const token = this.signToken(newUser._id);

            res.status(200).json({
                status: 'success',
                token,
                data: { user: newUser }
            });
        });
    }

    /**
     * name
     */
    public signIn() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const { email, password } = req.body;

            if(!email || !password) {
                return next(new AppError("Please provide email and password", 400));
            }

            const user = await User.findOne({ email }).select('+password');

            if(!user || !await user.correctPassword(password, user.password)) {
                return next(new AppError('Incorrect email or password', 401));
            }
            const token = this.signToken(user._id);;

            res.status(201).json({
                status: 'success',
                token
            });

        });
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