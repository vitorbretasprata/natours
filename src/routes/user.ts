import express from "express";

import UserController from "../controllers/user";

const router = express.Router();
const controller = new UserController();

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