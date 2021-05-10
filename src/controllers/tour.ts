import { NextFunction, Request, Response } from 'express';
import APIFeatures from '../helpers/apiFeatures';
import Tour from "../model/tour";
import AppError from "../helpers/appError";

export default class TourController  {


    public catchAsync (fn : Function) {
        return (req : Request, res : Response, next : NextFunction) => {
            fn(req, res, next).catch(next);
        }
    }

    public getTopTours(req : Request, res : Response, next : NextFunction) {

        req.query.limit = "5";
        req.query.sort = "-ratingAverage,price";
        req.query.fields = 'name,price,ratingAverage,summary,difficulty';
        next();
    }

    public async getTourStats() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const stats = await Tour.aggregate([
                {
                    $match: { ratingAverage: { $gte: 4.5 } }
                },
                {
                    $group: {
                        _id: null,
                        numRatings: { $sum: '$ratingsQuantity' },
                        numTours: { $sum: 1 },
                        avgRating: { $avg: '$ratingsAverage' },
                        avgPrice: { $avg: '$price' },
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' }
                    }
                },
                {
                    $sort: { avgPrice: 1 }
                }
            ]);

            res.status(200).json({
                status: 'success',
                data: {
                    stats
                }
            });
        });
    }

    public async getMonthlyPlan() {

        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const year = (typeof req.query.year === 'string') ? parseInt(req.query.year, 10) : new Date().getFullYear();

            const plan = await Tour.aggregate([
                {
                    $unwind: '$startDates'
                },
                {
                    $match: { 
                        startDates: { 
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`),
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$startDates' },
                        numToursStarts: { $sum: 1 },
                        tours: { $push: '$name' }
                    }
                },
                {
                    $addFields: { month: '$_id' }
                },
                {
                    $project: {
                        _id: 0
                    }
                },
                {
                    $sort: { numToursStarts: -1 }
                },
                {
                    $limit: 12
                }
            ]);

            res.status(200).json({
                status: 'success',
                data: {
                    plan
                }
            });
        });
    }

    /**
     * name
     */
    public async getAll() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const features = new APIFeatures(Tour.find(), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();

            const tours = await features.query;

            res.status(200).json({
                status: 'success',
                results: tours.length,
                data: { 
                    tours
                }
            });
        });
    }

    /**
     * name
     */
    public async create() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const newTour = await Tour.create(req.body);

            res.status(201).json({
                status: 'success',
                data: {
                    id: newTour.id
                }
            });
        });
    }

    /**
     * name
     */
    public async get() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const tour = await Tour.findById(req.params.id);

            if(!tour) {
                return next(new AppError("No tour found with that ID", 404));
            }

            res.status(200).json({
                status: 'success',
                data: { 
                    tour
                }
            });
        });
    }

    /**
     * name
     */
    public async update() {

        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if(!tour) {
                return next(new AppError("No tour found with that ID", 404));
            }

            res.status(200).json({
                status: 'success',
                data: { 
                    tour
                }
            });
        });
    }

    /**
     * name
     */
    public async delete() {

        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const tour = await Tour.findByIdAndDelete(req.params.id);

            if(!tour) {
                return next(new AppError("No tour found with that ID", 404));
            }

            res.status(204).json({
                status: 'success',
                data: null
            });
        });
    }

}