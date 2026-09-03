import { Course } from "../models/course.model.js"
import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"

export const getAnalyitcsData= async()=>{
    const totalUser = await User.countDocuments()
    const totalCourse = await Course.countDocuments()

    const salesData = await Order.aggregate([
        {
            $group:{
                _id:null,
                totalEntrollments:{$sum:1},
                totalRevenue:{$sum:'$totalAmount'}
            }
        }
    ])

    const {
        totalEntrollments=0,
        totalRevenue=0
    } = salesData[0]|| {}


    return {
        users:totalUser,
        courses:totalCourse,
        totalEntrollments,
        totalRevenue
    }
}


// total enrollment hain humarey pass 3
// order 1 value-> 1
// order 2 value-> 1
// order 3 value-> 1

// total enrollment = 3



export const getAnalyticsDataController=async(req,res)=>{
    try {
        const data = await getAnalyitcsData()
        return res.status(201).json(data)
    } catch (error) {
        console.log(error)
    }
}



export const dailyEnrollmentData= async(startDate, endDate)=>{
    try {

        const dailyData = await Order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:startDate,
                        $lte:endDate
                    }
                }
            },


            {
                $group:{
                    _id:{
                        $dateToString:{format:"%Y-%m-%d", date:"$createdAt"}
                    },
                    enrollments:{$sum:1},
                    revenue:{$sum:"$totalAmount"}
                },
            },
            {$sort:{_id:1}}
        ])


        const dateArray = getDatesInRange(startDate,endDate)

        return dateArray.map((date)=>{
            const found = dailyData.find((item)=>item._id===date)
            return{
                date,
                enrollments:found?.enrollments||0,
                revenue:found?.revenue||0
            }
        })

        
        
    } catch (error) {
        console.log(error)
    }

}


function getDatesInRange(startDate, endDate){
    const dates=[]
    let currentDate = new Date(startDate)

    while(currentDate<= endDate){
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate()+1)
    }

    return dates
}


export const getDailyAnalytcController=async(req,res)=>{
    try {
        const{startDate, endDate}= req.query

        if(!startDate || !endDate){
            return res.status(401).json({
                message:"Date not found"
            })
        }

        const start = new Date(startDate)
        const end = new Date(endDate)


        const data = await dailyEnrollmentData(start, end)

        return res.status(201).json(data)
    } catch (error) {
        console.log(error)
    }
}