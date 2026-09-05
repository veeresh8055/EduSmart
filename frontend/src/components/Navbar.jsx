import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLoggedOut } from '@/hooks/User.hook'
import { Spinner } from './ui/spinner'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/Store/user.store'
import { LogOut, User, LayoutDashboard, BookOpen } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useLoggedOut()
  const { user } = useUserStore()

  const logoutHandler = () => {
    mutate()
  }

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => navigate('/dashboard')
    },
    {
      label: 'Profile',
      icon: User,
      onClick: () => navigate('/profile')
    },
    {
      label: 'Your Courses',
      icon: BookOpen,
      onClick: () => navigate('/YourCourse')
    },
    {
      label: 'Logout',
      icon: LogOut,
      onClick: logoutHandler,
      loading: isPending
    }
  ]

  return (
    <div className='h-[12vh] w-full flex items-center justify-between px-6 lg:px-9 shadow-lg bg-white/80 backdrop-blur-sm border-b border-slate-100'>
      {/* Logo - Professional Typography */}
      <div className='flex items-center gap-3'>
        <h1 className='text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent tracking-tight'>
          EduSmart
        </h1>
      </div>

      {/* User Menu */}
      <Popover>
        <PopoverTrigger className='flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 group cursor-pointer'>
          <Avatar className='w-10 h-10 ring-2 ring-slate-200 group-hover:ring-slate-300 transition-all'>
            <AvatarImage 
              src={user?.profilePhoto || "https://github.com/shadcn.png"} 
              className='object-cover'
            />
            <AvatarFallback className='bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 font-semibold text-sm'>
              {user?.fullName ? user.fullName.slice(0,2).toUpperCase() : 'CN'}
            </AvatarFallback>
          </Avatar>
          
          <div className='hidden md:block text-left'>
            <p className='font-semibold text-sm text-slate-900 leading-tight'>
              {user?.fullName || 'User'}
            </p>
            <p className='text-xs text-slate-500 font-medium tracking-wide'>
              {user?.email?.split('@')[0] || 'Member'}
            </p>
          </div>

          {/* Chevron indicator */}
          <svg className='w-4 h-4 text-slate-400 ml-1 group-hover:text-slate-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </PopoverTrigger>

        <PopoverContent className='w-64 p-1 mt-2 border-slate-200 shadow-2xl rounded-2xl'>
          <div className='p-4 border-b border-slate-100'>
            <p className='font-semibold text-slate-900 text-sm tracking-tight'>
              {user?.fullName || 'Welcome back'}
            </p>
            <p className='text-xs text-slate-500 font-medium'>
              Manage your account
            </p>
          </div>

          <div className='py-2 space-y-1'>
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                disabled={item.loading}
                className='group relative w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 hover:bg-slate-50 hover:shadow-md text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <item.icon className='w-4 h-4 text-slate-500 group-hover:text-slate-700 flex-shrink-0' />
                <span className='truncate'>{item.label}</span>
                
                {item.loading && (
                  <div className='absolute right-4'>
                    <Spinner size='sm' />
                  </div>
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Navbar