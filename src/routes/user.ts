import express from "express";

import UserController from "../controllers/user";

const router = express.Router();
const controller = new UserController();

router.post("/signup", controller.signUp);
router.post("/signin", controller.signIn);

router
    .route("/")
    .get(controller.signUp)
    .post(controller.create)

router
    .route("/:id")
    .get(controller.get)
    .patch(controller.update)
    .delete(controller.delete)

export default router;