import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

const Cancel = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6'>
      <div className='max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center border border-slate-200'>
        <div className='w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8'>
          <ArrowLeft className='w-12 h-12 text-red-600' />
        </div>
        <h1 className='text-3xl font-black text-slate-900 mb-4'>Page Not Found</h1>
        <p className='text-slate-600 text-lg mb-8 leading-relaxed'>
          The page you're looking for doesn't exist or requires special access.
        </p>
        
        <div className='space-y-3'>
          <Link to='/dashboard'>
            <button className='w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5'>
              Go to Dashboard
            </button>
          </Link>
          
          <Link to='/'>
            <button className='w-full border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-4 px-8 rounded-2xl transition-all duration-200 hover:shadow-md'>
              <Home className='w-5 h-5 inline mr-2' />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cancel