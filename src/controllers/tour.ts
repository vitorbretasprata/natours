import { Request, Response, NextFunction } from 'express';
import Tour from "../model/tour";

export default class TourController  {

    constructor() {
        
    }

    /**
     * name
     */
    public getAll(req : Request, res : Response, next : NextFunction) {

        res.status(200).json({
            status: 'success'
        });
    }

    /**
     * name
     */
    public async create(req : Request, res : Response, next : NextFunction) {

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
    public get(req : Request, res : Response, next : NextFunction) {

        res.status(200).json({
            status: 'success'
        });
    }

    /**
     * name
     */
    public update(req : Request, res : Response, next : NextFunction) {

        res.status(500).json({
            status: 'Failed',
            message: "Invalid ID"
        });


        res.status(201).json({
            status: 'success'
        });
    }

    /**
     * name
     */
    public delete(req : Request, res : Response, next : NextFunction) {

        res.status(204).json({
            status: 'success',
            data: null
        });
    }

}