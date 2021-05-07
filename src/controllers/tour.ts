import { NextFunction, Request, Response } from 'express';
import APIFeatures from '../helpers/apiFeatures';
import Tour from "../model/tour";

export default class TourController  {

    public getTopTours(req : Request, res : Response, next : NextFunction) {

        req.query.limit = "5";
        req.query.sort = "-ratingAverage,price";
        req.query.fields = 'name,price,ratingAverage,summary,difficulty';
        next();
    }

    public async getTourStats(req : Request, res : Response) {

        try {
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
                }
            ]);

            res.status(200).json({
                status: 'success',
                data: {
                    stats
                }
            });

        } catch (err) {
            res.status(404).json({
                status: "failed",
                message: err.massage
            });
        }
    }

    /**
     * name
     */
    public async getAll(req : Request, res : Response) {

        try {
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
        } catch (err) {
            res.status(404).json({
                status: "failed",
                message: err.massage
            });
        }
    }

    /**
     * name
     */
    public async create(req : Request, res : Response) {

        try {
            const newTour = await Tour.create(req.body);

            res.status(201).json({
                status: 'success',
                data: {
                    id: newTour.id
                }
            });
        } catch (err) {
            res.status(400).json({
                status: "failed",
                message: err.massage
            });
        }
    }

    /**
     * name
     */
    public async get(req : Request, res : Response) {

        try {
            const tours = await Tour.findById(req.params.id);

            res.status(200).json({
                status: 'success',
                data: { 
                    tours
                }
            });
        } catch (err) {
            res.status(404).json({
                status: "failed",
                message: err.massage
            });
        }
    }

    /**
     * name
     */
    public async update(req : Request, res : Response) {

        try {
            const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            res.status(200).json({
                status: 'success',
                data: { 
                    tour
                }
            });
        } catch (err) {
            res.status(404).json({
                status: "failed",
                message: err.massage
            });
        }
    }

    /**
     * name
     */
    public async delete(req : Request, res : Response) {

        try {
            await Tour.findByIdAndDelete(req.params.id);

            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (err) {
            res.status(404).json({
                status: "failed",
                message: err.massage
            });
        }
    }

}