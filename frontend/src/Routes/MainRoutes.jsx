import Login from '@/Pages/Auth/Login'
import Register from '@/Pages/Auth/Register'
import Home from '@/Pages/User/Home'
import SingleCourse from '@/Pages/User/SingleCourse'
import YourCourse from '@/Pages/User/YourCourse'
import SinglePurchasedCourse from '@/Pages/User/SinglePurchasedCourse'
import Dashboard from '@/Pages/Admin/Dashboard'
import DashboardAnalytics from '@/Pages/Admin/DashboardAnalytics'
import DashboardProducts from '@/Pages/Admin/DasbhoardProducts'
import CreateModule from '@/Pages/Admin/CreateModule'
import Quiz from '@/Pages/User/Quiz'
import Cancel from '@/Pages/Admin/Cancel'
import PaymentSuccess from '@/Pages/Admin/PaymenSuccess'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoute'

const UserRoute = ({ children }) => <ProtectedRoutes>{children}</ProtectedRoutes>
const AdminRoute = ({ children }) => <ProtectedRoutes adminOnly>{children}</ProtectedRoutes>

const MainRoutes = () => (
  <Routes>
    <Route path="/" element={<UserRoute><Home /></UserRoute>} />
    <Route path="/cancel" element={<UserRoute><Cancel /></UserRoute>} />
    <Route path="/purchase" element={<UserRoute><PaymentSuccess /></UserRoute>} />
    <Route path="/singleCourse/:id" element={<UserRoute><SingleCourse /></UserRoute>} />
    <Route path="/YourCourse" element={<UserRoute><YourCourse /></UserRoute>} />
    <Route path="/YourCourse/:id" element={<UserRoute><SinglePurchasedCourse /></UserRoute>} />
    <Route path="/quiz/:id" element={<UserRoute><Quiz /></UserRoute>} />
    <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>}>
      <Route index element={<DashboardAnalytics />} />
      <Route path="dashboardProduct" element={<DashboardProducts />} />
      <Route path="CourseModule/:id" element={<CreateModule />} />
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<UserRoute><Home /></UserRoute>} />
  </Routes>
)

export default MainRoutes
