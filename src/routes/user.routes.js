import {Router} from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router();

// in this we have upload whic is multer middleware
router.route("/register").post(upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage", maxCount:1}
]),registerUser);

router.route("/login").post(loginUser);

// secure route
router.route("/logout").post(verifyJwt ,logoutUser);
router.route("/refresh-token").post(logoutUser);


export default router;