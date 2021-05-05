import { Request, Response, NextFunction } from 'express';

export default class UserController  {


    /**
     * name
     */
    public getAll(req : Request, res : Response, next : NextFunction) {
        res.status(200).json({
            status: 'success',
            message: "This functionallity is not complete yet."
        });
    }

    /**
     * name
     */
    public create(req : Request, res : Response, next : NextFunction) {
        res.status(201).json({
            status: 'success',
            message: "This functionallity is not complete yet."
        });
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
    public update(req : Request, res : Response, next : NextFunction) {
        res.status(201).json({
            status: 'success',
            message: "This functionallity is not complete yet."
        });
    }

    /**
     * name
     */
    public delete(req : Request, res : Response, next : NextFunction) {
        res.status(204).json({
            status: 'success',
            message: "This functionallity is not complete yet."
        });
    }

}