import { promisify } from "util";
import crypto from "crypto";
import { Request, Response, NextFunction } from 'express';
import AppError from "../helpers/appError";
import Review from "../model/review";
import HandlerFactory from "./handlerFactory";

interface RequestBody extends Request {
    body: any
    user? : any
}

export default class ReviewController  {

    public factory;

    constructor () {
        this.factory = new HandlerFactory();
    }

    private catchAsync (fn : Function) {
        return (req : Request, res : Response, next : NextFunction) => {
            fn(req, res, next).catch(next);
        }
    }

    public setToursUserId (req : RequestBody, res : Response, next : NextFunction) {
        if(!req.body.tour) req.body.tour = req.params.tourId;
        if(!req.body.user) req.body.user = req.user.id;

        next();
    }

    /**
     * name
     */
     public async getAll() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            let filter = {}

            if(!req.params.tourId) filter = { tour: req.params.tourId };

            const reviews = await Review.find(filter);

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
        this.factory.createOne(Review);
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
        this.factory.updateOne(Review);
    }

    /**
     * name
     */
    public async delete() {
        this.factory.deleteOne(Review);
    }
}