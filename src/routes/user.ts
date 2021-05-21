import express from "express";
import UserController from "../controllers/users";
import AuthController from "../controllers/auth";

const router = express.Router();
const authController = new AuthController();
const userController = new UserController();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get('/logout', authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router
    .route("/me")
    .get(
        authController.protect,
        userController.getMe,
        userController.get
    );

router.patch("/updateMyPassword", authController.resetPassword);
router.patch("/update", userController.update);
router.patch("/delete", userController.delete);

router.use(authController.restrictTo('admin'));

router
    .route("/")
    .get(authController.signUp)


    

export default router;