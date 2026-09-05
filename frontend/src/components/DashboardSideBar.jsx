import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingBag, 
 
  Home,
  BarChart3 
} from 'lucide-react'

const DashboardSideBar = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/dashboardProduct', label: 'Courses', icon: ShoppingBag },
    
  ]

  return (
    <div className='w-64 bg-white shadow-xl border-r border-slate-200'>
      <div className='p-6 border-b border-slate-200'>
        <h1 className='text-2xl font-black text-slate-900 tracking-tight'>EduSmart</h1>
        <p className='text-xs text-slate-500 font-medium mt-1'>Admin Dashboard</p>
      </div>

      <nav className='p-4 space-y-1'>
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => 
              `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
              ${isActive 
                ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:shadow-md'
              }`
            }
          >
            <item.icon className='w-5 h-5 flex-shrink-0' />
            <span className='truncate'>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default DashboardSideBar