import cloudinary from "../config/cloudinary.js";
import { ENV } from "../config/env.js";
import { Course } from "../models/course.model.js";
import { GoogleGenerativeAI } from '@google/generative-ai'
import { User } from "../models/user.model.js"; 

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model:'gemini-3.6-flash'})

export const createCourse =async(req , res)=>{
    try {
        const {title, description, amount} = req.body;
        const thumbnail = req.file

        if(!title || !description || !amount){
            return res.status(401).json({
                message:"Please provide all the detail"
            })
        }

        let imageUrl =""
        
        const base64 = `data:${req.file.mimetype};base64,${thumbnail.buffer.toString("base64")}`;

      
        const uploadRes = await cloudinary.uploader.upload(base64,{
            folder:"lmsYT"
        })

        
        imageUrl = uploadRes.secure_url

        const newCourse = new Course({
            userId:req.user._id,
            title,
            description,
            thumbnail:imageUrl,
            amount
        })

        await newCourse.save()

        return res.status(201).json({
            message:"Course Created Successfully",
            newCourse
        })

    } catch (error) {
         return res.status(500).json({
            message:"Error in Creating a corse",
             error: error.message
        })
    }
}



export const getCourse = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    if (!search) {
      const courses = await Course.find().lean();

      return res.status(200).json({
        success: true,
        courses,
        count: courses.length
      });
    }

    const prompt = `
Return exactly one of these categories:
Artificial intelligence
MERN Stack
DevOps
Mobile Development
Javascript 
Python 


User search: ${search}
`;

    const result = await model.generateContent(prompt);

    const aiText = result.response.text()
      .trim()
      .replace(/[`"\n.]/g, "");

    console.log("User search:", search);
    console.log("AI category:", aiText);

    // Search with both user text and AI category.
    const searchTerms = [search, aiText].filter(Boolean);

    const courses = await Course.find({
      $or: searchTerms.flatMap((term) => [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } }
      ])
    }).lean();

    return res.status(200).json({
      success: true,
      courses,
      count: courses.length,
      searchTerm: search,
      aiCategory: aiText
    });
  } catch (error) {
    console.error("getCourse error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not search courses"
    });
  }
};


export const getSingleCourse=async(req,res)=>{
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId).populate("modules")


        if(!course){
            return res.status(401).json({
                message:"Course not found"
            })
        }


        return res.status(201).json(course)
    } catch (error) {
        console.log(error ," from get single course")
    }
}


// user ne 4 course purchase kiye 
// lekin ab user jo hai woh kisi ek course se padhna chahta hai 
// toh user kisi ek course koi padhen k liye selecte karega toh uske liye humne getpurchase course ka controller create kiye hai yeh apko ek single course provide karega from purchased course

export const getPurchasedCourse = async(req,res)=>{
    try {
        const courseId = req.params.id;

        if(!courseId){
            return res.status(401).json({
                message:"course not found"
            })
        }

        const hasAccess = req.user.admin || req.user.purchasedCourse.some(
            (purchasedId) => purchasedId.toString() === courseId
        )
        if (!hasAccess) {
            return res.status(403).json({ message: "Purchase this course to access its content" })
        }

        const purchasedOrder = await Course.findById(courseId).populate("modules")


        if(!purchasedOrder){
            return res.status(401).json({
                message:"Course not found"
            })
        }


        return res.status(201).json(purchasedOrder)
    } catch (error) {
        console.log(error, "from getPurchased course")
    }
}


export const getAllPurchasedCourse = async(req,res)=>{
    try {
        const userId = req.user._id

        const user = await User.findById(userId).populate("purchasedCourse")

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }

        return res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
}
