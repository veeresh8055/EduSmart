import mongoose from "mongoose";

const userSchema  = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    },

    purchasedCourse:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
            
        }
    ],
    profilePhoto:{type:String}
},{timestamps:true})


export const User = mongoose.model("User", userSchema)