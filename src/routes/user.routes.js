import {Router} from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, loginUser, logoutUser, registerUser, updateAccount, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
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
router.route("/change-password").post(verifyJwt,changeCurrentPassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt,updateAccount);
router.route("/avatar").patch(verifyJwt,upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyJwt,upload.single("cover-image"),updateUserCoverImage);
router.route("/c/:username").get(verifyJwt, getUserChannelProfile);

export default router;