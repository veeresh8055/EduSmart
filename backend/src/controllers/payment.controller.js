import { ENV } from "../config/env.js";
import { stripe } from "../config/stripe.js";
import { Course } from "../models/course.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export const createCheckOutSession= async(req ,res)=>{
    try {
        const {products} = req.body;

        if(!products){
            return res.status(401).json({
                message:"Please provide course"
            })
        }

        const courseId = products._id

        const course =  await Course.findById(courseId)
        if(!course){
            return res.status(401).json({
                message:"Course not found"
            })
        }

        const alreadyPurchased = await  Order.findOne({
            user:req.user._id,
            course:courseId
        })

        if(alreadyPurchased){
            return res.status(201).json({
                message:"You already have this course "
            })
        }

        const session   = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:[
                {
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name:products.name,
                            images:[products.image]
                        },
                        unit_amount:Math.round(products.price*100)
                    },
                    quantity:1
                }
            ],
            mode:'payment',

            success_url:`${ENV.CLIENT_URL}/purchase?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${ENV.CLIENT_URL}/cancel`,
            metadata:{
                userId:req.user._id.toString(),
                courseId:courseId,
                coursePrice:products.price
            }
        })

        return res.status(201).json({
            success:true,
            sessionId:session.id,
            url:session.url
        })


        // FRONTEND URL = http://localhost:5173
    } catch (error) {
        console.log(error, "from create checkout session")
    }
}



export const checkoutSuccess=async(req,res)=>{
    try {
        const {sessionId} = req.body;
        if(!sessionId){
            return res.status(401).json({
                message:"Id not found"
            })
        }

        const existingOrder = await Order.findOne({stripeSessionId:sessionId})

        if(existingOrder){
            return res.status(201).json({
                message:"Order already created"
            })
        }

        const session   = await stripe.checkout.sessions.retrieve(sessionId)

        if(session.payment_status==="paid"){
            const courseId = session.metadata.courseId
            const userId = session.metadata.userId


            const newOrder =  new Order({
                user:userId,
                course:courseId,
                totalAmount:session.amount_total/100,
                stripeSessionId:sessionId
            })

            await newOrder.save()

            await User.findByIdAndUpdate(
                userId,
                { $push: { purchasedCourse: courseId } }
            )

            return res.status(201).json({
                message:"payment succesfully",
                orderId: newOrder._id
            })
        }


        return res.status(401).json({
            message:"Payment failed"
        })
    } catch (error) {
        console.log(error, "from checkout success")
    }
}