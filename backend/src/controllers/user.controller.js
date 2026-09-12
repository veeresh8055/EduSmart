import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ENV } from "../config/env.js";
import cloudinary from "../config/cloudinary.js";

const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax'
}


export const Register = async(req ,res)=>{
    try {
        const {fullName, email, password} = req.body;

        if(!fullName || !email || !password){
            return res.status(401).json({
                message:"Please provide all the details", 
                success:false
            })
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(401).json({
                message:"User already exist"
            })
        }

        // virendra
        // hash password :- asflkhagf@#$%@#^%aFGA35,
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword
        })

        const token = await jwt.sign({userId:newUser._id},ENV.JWT_SECRET )

        if(newUser.email === ENV.ADMIN){
            return res.status(201).cookie("token", token, cookieOptions).json({
                message:`welcome back admin ${newUser.fullName}`,
                
            })
        }

        return res.status(201).cookie("token", token, cookieOptions).json({
                message:`welcome back  ${newUser.fullName}`
            })


    } catch (error) {
        console.log(`error from register backend, ${error}`)
    }
}


export const Login = async(req,res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                messsage:"Please provide all the details"
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                message:"Erorr in email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
             return res.status(401).json({
                message:"Erorr in email or password"
            })
        }

        if(user.email == ENV.ADMIN){
            user.admin = true,
            await user.save()
        }

        const token = await jwt.sign({userId:user._id},ENV.JWT_SECRET )

        res.cookie("token", token, cookieOptions)

        if(user.admin){
            return res.status(201).json({
                message:"Welcome back admin"
            })
        }


        return res.status(201).json({
            message:`Welcome ${user.fullName}`
        })


        
    } catch (error) {
        console.log(`error from Login backend, ${error}`)
    }
}


export const getUser = async(req,res)=>{
    try {
        const userId = req.user._id

        const user = await User.findById(userId)

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }


        return res.status(201).json(user)
    } catch (error) {
        console.log(`error from get User, ${error}`)
    }
}


export const logout=async(req,res)=>{
    try {
        return res.clearCookie("token", cookieOptions).status(201).json({
            message:"User logged out"
        })
    } catch (error) {
        console.log(error)
    }
}



export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName } = req.body;
        
        const updateData = {};
        
        if (fullName) {
            updateData.fullName = fullName;
        }
        
        // Safe file check
        if (req.file) {
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            
            const uploadRes = await cloudinary.uploader.upload(base64, {
                folder: "profilePhoto",
            });
            
            updateData.profilePhoto = uploadRes.secure_url;
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
        
    } catch (error) {
        console.error('Update Profile Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
