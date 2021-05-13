import { promisify } from "util";
import crypto from "crypto";
import { Request, Response, NextFunction } from 'express';
import AppError from "../helpers/appError";
import Review from "../model/review";

interface RequestBody extends Request {
    body: any
    user? : any
}

export default class ReviewController  {

    private catchAsync (fn : Function) {
        return (req : Request, res : Response, next : NextFunction) => {
            fn(req, res, next).catch(next);
        }
    }

    /**
     * name
     */
     public async getAll() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const reviews = await Review.find();

            res.status(200).json({
                status: 'success',
                results: reviews.length,
                data: {
                    reviews
                }
            });
        });
    }

    /**
     * name
     */
    public async create() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const newReview = await Review.create(req.body);

            res.status(200).json({
                status: 'success',
                data: {
                    newReview
                }
            });
        });
    }

    /**
     * name
     */
    public async get() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const review = await Review.findById(req.params.id);

            if(!review) {
                return next(new AppError("No review found with that ID", 404));
            }

            res.status(200).json({
                status: 'success',
                data: { 
                    review
                }
            });
        });
    }

    /**
     * name
     */
    public async update() {

        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if(!review) {
                return next(new AppError("No review found with that ID", 404));
            }

            res.status(200).json({
                status: 'success',
                data: { 
                    review
                }
            });
        });
    }

    /**
     * name
     */
    public async delete() {

        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const review = await Review.findByIdAndDelete(req.params.id);

            if(!review) {
                return next(new AppError("No review found with that ID", 404));
            }

            res.status(204).json({
                status: 'success',
                data: null
            });
        });
    }
}