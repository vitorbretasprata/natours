import { Request, Response, NextFunction } from 'express';
import Tour from "../model/tour";

export default class TourController  {

    constructor() {
        
    }

    /**
     * name
     */
    public async getAll(req : Request, res : Response) {

        try {
            const tours = await Tour.find();

            const queryObj =  {... req.query}

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