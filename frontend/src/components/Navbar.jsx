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
import { LogOut, LayoutDashboard, BookOpen , House } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { mutate, isPending } = useLoggedOut()
  const { user } = useUserStore()

  const logoutHandler = () => {
    mutate()
  }

  const navItems = [
      {
      label: 'Home',
      icon: House,
      onClick: () => navigate('/')
    },
    ...(user?.admin ? [{
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => navigate('/dashboard')
    }] : []),
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
    <header className='sticky top-0 z-40 h-18 w-full flex items-center justify-between px-5 py-4 lg:px-10 bg-[#fffdf9]/90 backdrop-blur-xl border-b border-[#e6ded2]'>
      {/* Logo - Professional Typography */}
      <div className='flex items-center gap-3'>
        <button onClick={() => navigate('/')} className='font-display text-xl lg:text-2xl font-extrabold text-[#282522] tracking-tight'>
          EduSmart
        </button>
      </div>

      {/* User Menu */}
      <Popover>
        <PopoverTrigger className='flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 group cursor-pointer'>
          <Avatar className='w-10 h-10 ring-2 ring-slate-200 group-hover:ring-slate-300 transition-all'>
            <AvatarImage 
              src={user?.profilePhoto} 
              className='object-cover'
            />
            <AvatarFallback className='bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 font-semibold text-sm'>
              {user?.fullName?.slice(0,2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className='hidden md:block text-left'>
            <p className='font-semibold text-sm text-slate-900 leading-tight'>
              {user?.fullName}
            </p>
            <p className='text-xs text-slate-500 font-medium tracking-wide'>
              {user?.email?.split('@')[0]}
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
              {user?.fullName}
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
    </header>
  )
}

export default Navbar
