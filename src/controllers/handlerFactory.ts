import { Request, Response, NextFunction } from 'express';
import AppError from "../helpers/appError";

export default class HandlerFactory {

    private catchAsync (fn : Function) {
        return (req : Request, res : Response, next : NextFunction) => {
            fn(req, res, next).catch(next);
        }
    }

    public deleteOne (Model : any) {
        return () => this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const doc = await Model.findByIdAndDelete(req.params.id);

            if(!doc) {
                return next(new AppError("No document found with that ID", 404));
            }

            res.status(204).json({
                status: 'success',
                data: null
            });
        })
    }

    public updateOne (Model : any) {
        return () => this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            if(!doc) {
                return next(new AppError("No document found with that ID", 404));
            }

            res.status(200).json({
                status: 'success',
                data: { 
                    doc
                }
            });
        });
    }

    public createOne (Model : any) {
        return () => this.catchAsync(async (req : Request, res : Response, next : NextFunction) => {

            const doc = await Model.create(req.body);

            res.status(201).json({
                status: 'success',
                data: {
                    doc
                }
            });
        });
    }

}