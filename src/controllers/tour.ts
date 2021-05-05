import { Request, Response, NextFunction } from 'express';
import fs from "fs";

export default class TourController  {

    private tours;

    constructor() {
        this.tours = JSON.parse(
            fs.readFileSync(`${process.env.ROOT_PROJECT}/dev-data/data/tours-simple.json`).toString()
        );
    }

    /**
     * name
     */
    public checkId(req : Request, res : Response, next : NextFunction, val: string) {
        const calInt = parseInt(val, 10);

        if(calInt > this.tours.length) {
            return res.status(404).json({
                status: 'Not Found'
            });
        }

        next();
    }

    /**
     * name
     */
     public checkBody(req : Request, res : Response, next : NextFunction) {

        if(!req.body.name || !req.body.price) {
            return res.status(404).json({
                status: 'Missing price or name'
            });
        }

        next();
    }

    /**
     * name
     */
    public getAll(req : Request, res : Response, next : NextFunction) {

        res.status(200).json({
            status: 'success',
            results: this.tours.length,
            data: {
                tour: this.tours
            }
        });
    }

    /**
     * name
     */
    public create(req : Request, res : Response, next : NextFunction) {
        const newId = this.tours[this.tours.length - 1].id + 1;
        const newTour = Object.assign({ id: newId }, req.body);

        this.tours.push(newTour);

        fs.writeFile(
            `${__dirname}/dev-data/data/tours-simple.json`,
            JSON.stringify(this.tours), 
            err => {
                res.status(201).json({
                    status: 'success',
                    data: {
                        tour: newTour
                    }
                });
            }
        );
    }

    /**
     * name
     */
    public get(req : Request, res : Response, next : NextFunction) {
        const id = parseInt(req.params.id, 10);

        const tour = this.tours.find((t : any) => t.id === id);

        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    }

    /**
     * name
     */
    public update(req : Request, res : Response, next : NextFunction) {
        const id = parseInt(req.params.id, 10);

        if(id > this.tours.length) {
            res.status(500).json({
                status: 'Failed',
                message: "Invalid ID"
            });
        }

        const tour = this.tours.find((t : any) => t.id === id);

        res.status(201).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    }

    /**
     * name
     */
    public delete(req : Request, res : Response, next : NextFunction) {
        const id = parseInt(req.params.id, 10);

        const tour = this.tours.find((t : any) => t.id === id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    }

}