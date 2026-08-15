import express, { Express } from "express";
import { RegisterUser, LoginUser, GetUserProfile } from "../controller/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";


const router = express.Router()

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/profile", verifyToken, GetUserProfile);

export default router