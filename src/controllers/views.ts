import { Request, Response, NextFunction } from 'express';
import AppError from '../helpers/appError';
import Tour from "../model/tour";

interface RequestBody extends Request {
    body: any
    user? : any
}

export default class ViewsController {

    private catchAsync (fn : Function) {
        return (req : Request, res : Response, next : NextFunction) => {
            fn(req, res, next).catch(next);
        }
    }

    /**
     * getOverview
     */
    public getOverview() {
        this.catchAsync(async (req : Request, res: Response) => {
            // 1 - Get tour data from collection
            const tours = await Tour.find();

            // 2 - Build template

            // 3 - Render that template using tour data from 1

            res.status(200).render('overview', {
                title: 'All Tours',
                tours
            });
        });
    }

    /**
     * getTour
     */
    public getTour() {
        this.catchAsync(async (req : Request, res: Response, next : NextFunction) => {
            //1 - Get the data, for the request tour (including reviews and guides)
            const tour = await Tour.findOne({ slug: req.params.slug }).populate({
                path: 'reviews',
                fields: 'reviews rating user'
            });

            if(!tour) {
                return next(new AppError('There is no tour with that name.', 404));
            }

            //2 - Build template

            //3 - Render template using data from 1

            res.status(200).render('tour', {
                title: `${tour.name} Tour`,
                tour
            });
        });
    }

    /**
     * getTour
     */
    public getLoginForm(req : Request, res: Response) {
        res.status(200).render('login', {
            title: `Log into your account`
        });
    }

    /**
     * getTour
     */
    public getAccount(req : Request, res: Response) {
        res.status(200).render('account', {
            title: `Your account`
        });
    }

}