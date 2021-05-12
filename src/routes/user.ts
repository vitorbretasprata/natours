import express from "express";
import UserController from "../controllers/users";

import AuthController from "../controllers/auth";

const router = express.Router();
const authController = new AuthController();
const userController = new UserController();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword", authController.resetPassword);

router.patch("/updateMyPassword", authController.protect, authController.resetPassword);
router.patch("/update", authController.protect, userController.update);

router.patch("/delete", authController.protect, userController.delete);

router
    .route("/")
    .get(authController.signUp)
    .post(authController.create)

router
    .route("/:id")
    .get(authController.get)
    .patch(authController.update)
    .delete(authController.delete)

export default router;