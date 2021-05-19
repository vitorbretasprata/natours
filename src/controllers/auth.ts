import { promisify } from "util";
import crypto from "crypto";
import { Request, Response, NextFunction } from 'express';
import User, { UserBaseDocument } from "../model/user";
import jwt, { SigningKeyCallback } from "jsonwebtoken";
import AppError from "../helpers/appError";
import sendEmail from "../helpers/email";

interface RequestBody extends Request {
    body: any
    user? : any
}

interface IToken extends SigningKeyCallback {
    iat? : string,
    id? : number | string
}

export default class AuthController  {

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

    private createSendToken (user : UserBaseDocument, code : number, res : Response) {
        const token = this.signToken(user._id);

        const cookieOptions : { [key : string] : any } = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        if(process.env.NODE_ENV === "production") cookieOptions.secure = true;
        res.cookie("jwt", token, cookieOptions);

        user.password = undefined;

        res.status(code).json({
            status: 'success',
            token,
            data: { user }
        });
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

            const decoded : IToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

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

            this.createSendToken(newUser, 201, res);
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

            this.createSendToken(user, 200, res);
        });
    }

    /**
     * name
     */
    public forgotPassword() {
        this.catchAsync(async (req : RequestBody, res : Response, next : NextFunction) => {
            const user = await User.findOne({ email: req.body.email });

            if(!user) {
                return next(new AppError("There is no user with this email address", 404));
            }

            const resetToken = user.createPasswordResetToken();

            await user.save({ validateBeforeSave: false });

            const resetURL = `${req.protocol}://${req.get('host')}//api/v1/users/resetPassword/${resetToken}`;
            const message = `Forgot your password? Submit a PATCH request with your new password ans passwordConfirm to: 
            ${resetURL}. \nIf you didn't forget your password, 
            please ignore this email!`;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Your password reset token (valid for 10 mins)',
                    message
                })
    
                res.status(201).json({
                    status: 'success',
                    message: 'Token sent to email!'
                });
            } catch (err) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;

                await user.save({ validateBeforeSave: false});
                return next(new AppError('There was an error sending the email. Try again later!', 500));
            }

        });
    }

    /**
     * name
     */
    public resetPassword() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const hashedToken = crypto
                .createHash("sha256")
                .update(req.params.token)
                .digest('hex');

            const user = await User.findOne({ 
                passwordResetToken : hashedToken, 
                passwordResetExpires: { $gt: Date.now() }
            });

            if(!user) {
                return next(new AppError("Token is invalid or expired", 400));
            }

            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;

            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            await user.save();

            this.createSendToken(user, 200, res);
        });
    }


    /**
     * name
     */
     public updatePassword() {
        this.catchAsync(async (req : RequestBody, res : Response, next : NextFunction) => {
            //1 - Get user from collection
            const user = await User.findById(req.user.id).select("+password");

            //2 - Check if password is correct
            if(!(user.correctPassword(req.body.passwordConfirm, user.password))) {
                return next(new AppError("Your password is wrong", 401));
            }

            //3 - If so, update password
            user.password = req.body.passwordConfirm;
            user.passwordConfirm = req.body.passwordConfirm;

            await user.save();
            //4 - Log user in, send JWT

            this.createSendToken(user, 200, res);
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
}