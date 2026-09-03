import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'
import { User } from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required - No token provided'
      })
    }

    // ✅ JWT verify with proper error handling
    let decode
    try {
      decode = jwt.verify(token, ENV.JWT_SECRET)
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message)
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: jwtError.message
      })
    }

    if (!decode || !decode.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload'
      })
    }

    const user = await User.findById(decode.userId).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or deleted'
      })
    }

    req.user = user
    next()

  } catch (error) {
    console.error('ProtectRoute error:', error)
    // ✅ CRITICAL FIX: Response bhejo!
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    })
  }
}

export const adminRoute = async (req, res, next) => {
  try {
    if (req.user && req.user.email === ENV.ADMIN) {
      next()
    } else {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      })
    }
  } catch (error) {
    console.error('AdminRoute error:', error)
    return res.status(500).json({
      success: false,
      message: 'Authorization failed'
    })
  }
}