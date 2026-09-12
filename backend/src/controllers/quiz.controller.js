import { GoogleGenerativeAI } from "@google/generative-ai";
import { Quiz } from "../models/quiz.model.js";
import { ENV } from "../config/env.js";
import { Questions } from "../models/question.model.js";
import { Modules } from "../models/module.model.js";

const genAi = new GoogleGenerativeAI(ENV.GEMINI_API_KEY)
const model = genAi.getGenerativeModel({model:'gemini-3.6-flash'})

const canAccessModule = async (user, moduleId) => {
    const module = await Modules.findById(moduleId).select('courseId')
    if (!module) return false
    return user.admin || user.purchasedCourse.some(
        (courseId) => courseId.toString() === module.courseId.toString()
    )
}

export const checkQuiz = async(req,res)=>{
    try {
        const moduleId = req.params.id;

        if (!await canAccessModule(req.user, moduleId)) {
            return res.status(403).json({ success: false, message: 'Course access required' })
        }

        const quiz = await Quiz.findOne({
            userId:req.user._id,
            moduleId
        })

        return res.status(200).json({
            success:true,
            hasQuiz: Boolean(quiz),
            quiz: quiz|| null

        })
    } catch (error) {
        console.log(error , "from check quiz")
        return res.status(500).json({
            success:false,
            message:"Unable to check quiz"
        })
    }
}


export const generateQuiz = async(req, res)=>{
    try {
        const {moduleId, content} = req.body;
        if(!moduleId || !content){
            return res.status(401).json({
                message:"Something is missing"
            })
        }

        if (!await canAccessModule(req.user, moduleId)) {
            return res.status(403).json({ message: 'Course access required' })
        }

        const existingQuiz = await Quiz.findOne({
            userId:req.user._id,
            moduleId
        })

        if(existingQuiz && existingQuiz.questions.length>0){
            return res.status(201).json({
                message:"You already generated quiz for this module"
            })
        }


        const newQuiz = await Quiz.create({
            userId:req.user._id,
            moduleId
        })


        const prompt =`Generate 10 technical question for ${content}. Each Question should be multiple choice with 4 options. Return the response  in this JSON  format, no additional text:
        {
        questions:[
        {
        "question":"string",
        "options":["string", "string", "string", "string"],
        "correctOption":"string",
        "explanation":"string"
        }
        ]
        }`

        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()

        const cleanText=  text.
        replace(/```json/gi,"")
        .replace(/```/g, "")
        .trim() // "text"

        let parsed 

        try {
            parsed  = JSON.parse(cleanText)
        } catch (error) {
            console.log("failed to parse gemini object", error)
            await Quiz.findByIdAndDelete(newQuiz._id)
            return res.status(500).json({message:"Quiz cannot be genrerated"})

        }


        const generateQuestion = parsed.questions || []

        if(!Array.isArray(generateQuestion) || generateQuestion.length===0){
            return res.status(500).json({message:"No questions generated"})
        }

        const createdQuestion = []

        for(const q of generateQuestion){
            const doc = await Questions.create({
                quizId:newQuiz._id,
                content:q.question,
                options:q.options,
                correctOption:q.correctOption,
                explanation:q.explanation

            })

            createdQuestion.push(doc)
        }


        const ids = createdQuestion.map((q)=>q._id)

        await Quiz.findByIdAndUpdate(
            newQuiz._id, 
            {$push:{questions:{$each:ids}}},
            {new:true}
            
        )

        await Modules.findByIdAndUpdate(
            moduleId,
            {quiz:newQuiz._id},
            {new:true}
        )

        return res.status(201).json({
            message:"Quiz generated"
        })
    } catch (error) {
        console.log(error, "error from generateQuiz")
    }
}


export const getQuiz = async(req,res)=>{
    try {
        const quizId = req.params.id;
        
        if(!quizId){
            return res.status(401).json({
                message:"quiz id not found"
            })
        }

        const quiz = await Quiz.findOne({
            _id:quizId,
            userId:req.user._id
        }).populate("questions")

        if(!quiz){
            return res.status(401).json({
                message:"Quiz not found"
            })
        }

        if (!await canAccessModule(req.user, quiz.moduleId)) {
            return res.status(403).json({ success: false, message: 'Course access required' })
        }

        return res.status(200).json({
            success:true,
            quiz
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Unable to load quiz"
        })
    }
}
