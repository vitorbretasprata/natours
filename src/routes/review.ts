import express from "express";

import ReviewController from "../controllers/review";
import AuthController from "../controllers/auth";

const controller = new ReviewController();
const authController = new AuthController();
const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(authController.protect, controller.getAll)
    .post(
        authController.protect, 
        authController.restrictTo('user'), 
        controller.setToursUserId, 
        controller.create
    );

router
    .route("/:id")
    .get(controller.get)
    .patch(controller.update)
    .delete(controller.delete)

export default router;