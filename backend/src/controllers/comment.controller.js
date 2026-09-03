import { Comment } from "../models/comment.model.js";
import { Modules } from "../models/module.model.js";
// import { Comment } from "../models/comment.model.js";
export const createComment = async(req, res)=>{
    try {
        const moduleId = req.params.id;
        const{comment} = req.body;
        const userId = req.user._id


        if(!moduleId){
            return res.status(401).json({
                message:"Module Id not found"
            })
        }

        if(!comment){
            return res.status(401).json({
                message:"comment is required"
            })
        }

        const module = await Modules.findById(moduleId)

        if(!module){
            return res.status(401).json({
                message:"Module not found"
            })
        }

        const newComment = await Comment.create({
            userId,
            moduleId,
            comment
        })

        await Modules.findByIdAndUpdate(
            moduleId,
            {$push:{comments:newComment._id}},
            {new:true}
        )

        const populatedComment = await Comment.findById(newComment._id).populate('userId', "fullName email")

        return res.status(201).json({
            message:"comment added",
            populatedComment
        })
    } catch (error) {
        console.log(error)
    }
}