import { NextFunction, Request, Response } from 'express';
import APIFeatures from '../helpers/apiFeatures';
import Tour from "../model/tour";
import AppError from "../helpers/appError";

import HandlerFactory from "./handlerFactory";

export default class TourController  {

    public factory;

    constructor () {
        this.factory = new HandlerFactory();
    }

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
        this.factory.createOne(Tour);
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
        this.factory.updateOne(Tour);
    }

    /**
     * name
     */
    public async delete() {
        this.factory.deleteOne(Tour);
    }

    public async getToursWithin() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const { distance, latlng, unit } = req.params;
            const [lat, lng] = latlng.split(',');

            const intDis = parseInt(distance, 10);

            const radius = unit === 'mi' ? intDis / 3963.2 : intDis / 6378.1;

            if(!lat || !lng) {
                next(new AppError("Please provide latitutr and longitude in the format lat,lng", 400));
            }

            const tours = await Tour.find({
                startLocation: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radius]
                    }
                }
            });

            res.status(200).json({
                status: 'success',
                results: tours.length,
                data: { tours }
            });
        });
    }

    public async getDistances() {
        this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const { latlng, unit } = req.params;
            const [lat, lng] = latlng.split(',');

            const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

            const intLat = parseInt(lat, 10);
            const intLng = parseInt(lng, 10);

            if(!lat || !lng) {
                next(new AppError("Please provide latitutr and longitude in the format lat,lng", 400));
            }

            const distances = await Tour.aggregate([
                {
                    $geoNear: { 
                        near: { 
                            type: 'Point',
                            coordinates: [intLng, intLat]
                        },
                        distanceField: 'distance',
                        distanceMultiplier: multiplier
                    }
                },
                {
                    $project: {
                        distance: 1,
                        name: 1
                    }
                }
            ]);

            res.status(200).json({
                status: 'success',
                data: { distances }
            });
        });
    }
}