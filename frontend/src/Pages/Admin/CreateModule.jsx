import { useGetSingleCourseHook } from '@/hooks/course.hook'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,DialogTrigger
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { useCreateModule } from '@/hooks/module.hook'
import { Spinner } from '@/components/ui/spinner'

const CreateModule = () => {
  const { id } = useParams()
  const { data } = useGetSingleCourseHook(id)
  const [openModule, setOpenModule] = useState(false)

  const { register, handleSubmit, reset } = useForm()
  const { mutate, isPending } = useCreateModule()

  const moduleFormHandler = (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('video', data.video[0])
    formData.append('courseId', id)

    mutate(formData, {
      onSuccess: () => {
        setOpenModule(false)
        reset()
      }
    })
  }

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      {/* Course Header */}
      <div className='mb-12'>
        <h1 className='text-3xl font-black text-slate-900 mb-2'>{data?.title}</h1>
        <div className='flex items-center gap-2 text-sm text-slate-600'>
          <span>Total Modules: {data?.modules?.length || 0}</span>
        </div>
      </div>

      {/* Create Module Button */}
      <Dialog open={openModule} onOpenChange={setOpenModule}>
        <DialogTrigger className='inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Create New Module
        </DialogTrigger>
        
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>New Module</DialogTitle>
            <form onSubmit={handleSubmit(moduleFormHandler)} className='space-y-6 mt-6'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Module Title</label>
                <input 
                  type="text" 
                  placeholder='Enter module title'  
                  className='w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all' 
                  {...register('title', { required: true })}
                />
              </div>
              
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Video File</label>
                <input 
                  type="file" 
                  accept='video/*' 
                  className='w-full px-4 py-3 border-2 border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer' 
                  {...register('video', { required: true })}
                />
              </div>
              
              <button 
                type='submit' 
                disabled={isPending}
                className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Creating...
                  </>
                ) : (
                  'Create Module'
                )}
              </button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modules List */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
        {data?.modules?.map((item, index) => (
          <div key={item._id || index} className='group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer hover:border-slate-300'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0'>
                <svg className='w-6 h-6 text-emerald-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                </svg>
              </div>
              <div>
                <h3 className='font-bold text-xl text-slate-900 group-hover:text-slate-700'>{item.title}</h3>
                <p className='text-sm text-slate-500'>Module {index + 1}</p>
              </div>
            </div>
            <div className='w-full bg-slate-200 rounded-full h-2'>
              <div className='bg-emerald-500 h-2 rounded-full w-3/4'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreateModule