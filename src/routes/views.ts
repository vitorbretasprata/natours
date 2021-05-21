import express from "express";
import ViewsController from "../controllers/views";
import AuthController from "../controllers/auth";

const router = express.Router();
const controller = new ViewsController();
const authController = new AuthController();

router.get('/overview', authController.isLoggedIn, controller.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, controller.getTour);
router.get('/login', authController.isLoggedIn, controller.getLoginForm);
router.get('/me', authController.protect, controller.getLoginForm);

export default router;