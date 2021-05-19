import express from "express";

import TourController from "../controllers/tour";
import AuthController from "../controllers/auth";

import reviewRouter from "./review";

const controller = new TourController();
const authController = new AuthController();
const router = express.Router();

router.route("/top-5-cheap").get(controller.getTopTours, controller.getAll);
router.route("/tour-stats").get(controller.getTourStats);
router.route("/get-monthly-plan/:year")
    .get(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide', 'guide'), 
        controller.getTourStats
    );

router.route('/tours-within/:distance/center/:latlng/unit/:unit', controller.getToursWithin);

router
    .route("/")
    .get(controller.getAll)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        controller.create
    );

router
    .route("/:id")
    .get(controller.get)
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        controller.update
    )
    .delete(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        controller.delete
    );

router.use('/:tourId/reviews', reviewRouter);

export default router;