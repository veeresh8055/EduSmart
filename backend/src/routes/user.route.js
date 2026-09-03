import express from "express";
import { getUser, Login, logout, Register, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";


const userRoute = express.Router()


userRoute.post('/register', Register)
userRoute.post('/login', Login)
userRoute.post('/logout', logout)
userRoute.get('/getUser',protectRoute, getUser)
userRoute.post('/updateProfile', protectRoute, upload.single("profilePhoto"), updateProfile)

export default userRoute