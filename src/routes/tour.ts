import express from "express";

import tourController from "../controllers/tour";

const controller = new tourController();
const router = express.Router();

router.route("/top-5-cheap").get(controller.getTopTours, controller.getAll);
router.route("/tour-stats").get(controller.getTourStats);
router.route("/get-monthly-plan/:year").get(controller.getTourStats);


router
    .route("/")
    .get(controller.getAll)
    .post(controller.create)

router
    .route("/:id")
    .get(controller.get)
    .patch(controller.update)
    .delete(controller.delete)

export default router;