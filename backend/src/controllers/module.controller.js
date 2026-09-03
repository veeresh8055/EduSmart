import { Course } from "../models/course.model.js";
import { Modules } from "../models/module.model.js";
import {Comment} from '../models/comment.model.js'
export const createModule = async(req,res)=>{
    try {
        const {courseId,  title}= req.body;
        if(!courseId || !title){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }

        if(!req.file){
            return res.status(401).json({
                message:"Please provide video"
            })
        }

        const videoUrl = req.file.path
        const publicId = req.file.filename

        const module = await Modules.create({
            courseId,
            title,
            video:videoUrl,
            videoPublicUrl :publicId
        })
        module.save()

        await Course.findByIdAndUpdate(courseId,{
            $push:{modules:module._id}
        })


        return res.status(201).json(module)
    } catch (error) {
        console.log(`error from create module, ${error}`)
    }
}


export const getSingleCourseModule = async(req,res)=>{
    try {
        const moduleId = req.params.id;
        if(!moduleId){
            return res.status(401).json({
                message:"Please provide module id"
            })
        }

        const singleModule = await Modules.findById(moduleId)

        if(!singleModule){
            return res.status(401).json({
                message:"Module not found"
            })
        }

        return res.status(201).json(singleModule)
    } catch (error) {
        console.log(error ,"from get single course module")
    }
}


export const getComment =async(req,res)=>{
    try {
        const moduleId = req.params.id;

        if(!moduleId){
            return res.status(401).json({
                message:"Please provide module Id"
            })
        }


        const moduleComment = await Modules.findById(moduleId).populate({
            path:'comments',
            populate:{
                path:'userId',
                select:'fullName email'
            },

            options:{sort:{createdAt:-1}}
        })

        return res.status(201).json(moduleComment.comments)
    } catch (error) {
        console.log(error , "from get comment")
    }
}