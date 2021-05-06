import express from "express";

import tourController from "../controllers/tour";

const controller = new tourController();
const router = express.Router();

router.param("id", (req, res, next, val) => {
    next();
});

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