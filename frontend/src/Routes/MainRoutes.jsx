import Login from '@/Pages/Auth/Login'
import Register from '@/Pages/Auth/Register'
import Home from '@/Pages/User/Home'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoute'
import SingleCourse from '@/Pages/User/SingleCourse'
import YourCourse from '@/Pages/User/YourCourse'
import SinglePurchasedCourse from '@/Pages/User/SinglePurchasedCourse'
import Dashboard from '@/Pages/Admin/Dashboard'
import DashboardAnalytics from '@/Pages/Admin/DashboardAnalytics'
import DasbhoardProducts from '@/Pages/Admin/DasbhoardProducts'
import CreateModule from '@/Pages/Admin/CreateModule'
import Quiz from '@/Pages/User/Quiz'
import Cancel from '@/Pages/Admin/Cancel'
import PaymenSuccess from '@/Pages/Admin/PaymenSuccess'

const MainRoutes = () => {
  return (
   <Routes>

    <Route path='/' element={
        <ProtectedRoutes>
            <Home/>
        </ProtectedRoutes>
    }/>
    <Route path='/cancel' element={
        <ProtectedRoutes>
            <Cancel/>
        </ProtectedRoutes>
    }/>
    <Route path='/purchase' element={
        <ProtectedRoutes>
            <PaymenSuccess/>
        </ProtectedRoutes>
    }/>
    <Route path='/singleCourse/:id' element={
        <ProtectedRoutes>
            <SingleCourse/>
        </ProtectedRoutes>
    }/>
    <Route path='/YourCourse' element={
        <ProtectedRoutes>
            <YourCourse/>
        </ProtectedRoutes>
    }/>
    <Route path='/YourCourse/:id' element={
        <ProtectedRoutes>
            <SinglePurchasedCourse/>
        </ProtectedRoutes>
    }/>
    <Route path='/quiz/:id' element={
        <ProtectedRoutes>
            <Quiz/>
        </ProtectedRoutes>
    }/>

    <Route path='/dashboard' element={
        <ProtectedRoutes>

            <Dashboard/>
        </ProtectedRoutes>
        } >
      
      <Route index  element={
        <ProtectedRoutes>
            
            <DashboardAnalytics/>
        </ProtectedRoutes>
        }/>
      <Route path='dashboardProduct' element={
          <ProtectedRoutes>
            <DasbhoardProducts/>

        </ProtectedRoutes>
        }/>
        <Route path='CourseModule/:id' element={
            <ProtectedRoutes>
                <CreateModule/>
            </ProtectedRoutes>
        }/>
    </Route>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
   </Routes>
  )
}

export default MainRoutes