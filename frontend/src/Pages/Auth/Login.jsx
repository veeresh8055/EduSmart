import { Spinner } from '@/components/ui/spinner'
import { useLoginHook } from '@/hooks/User.hook'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const { mutate, isPending } = useLoginHook()

  const loginFormHandler = (data) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eee5d9] px-4 py-10">
      <div className="page-enter w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-7 sm:p-9">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            ⚡
          </div>
          <p className="eyebrow mb-2">Welcome back</p><h1 className="font-display text-3xl font-extrabold text-gray-900">Continue learning.</h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue to your dashboard
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(loginFormHandler)}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center"
          >
            {isPending ? <Spinner /> : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
