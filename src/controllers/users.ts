import { Request, Response, NextFunction } from 'express';
import User, { UserBaseDocument } from "../model/user";
import AppError from "../helpers/appError";
import sendEmail from "../helpers/email";
import HandlerFactory from "./handlerFactory";
interface RequestBody extends Request {
    body: any
    user? : any
}

export default class UserController  {

    public factory;

    constructor () {
        this.factory = new HandlerFactory();
    }

    private catchAsync (fn : Function) {
        return (req : Request, res : Response, next : NextFunction) => {
            fn(req, res, next).catch(next);
        }
    }

    private filterOjb(obj : any, ...allowedFields: Array<string>) {
        const newObj : { [key : string] : any } = {};
        Object.keys(obj).forEach(el => {
            if(allowedFields.includes(el)) {
                newObj[el] = obj[el];
            }
        });

        return newObj;
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
    public getMe(req : RequestBody, res : Response, next : NextFunction) {
        req.params.id = req.user.id;
        next();
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
    public update(req : RequestBody, res : Response, next : NextFunction) {

        this.catchAsync(async (req : RequestBody, res : Response, next : NextFunction) => {
            //1 - Create error if POSTs password data
            if(req.body.password || req.body.passwordConfirm) {
                return next(new AppError("This route is not for password updates.", 400));
            }

            //2 - Filtered unwanted fields
            const filteredBody = this.filterOjb(req.body, 'name', 'email');

            //3 - Update user document
            const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
                new: true,
                runValidators: true
            });

            res.status(200).json({
                status: 'success',
                data: { user }
            });
        });
    }

    /**
     * name
     */
    public delete(req : Request, res : Response, next : NextFunction) {
        this.factory.deleteOne(User)
    }

}