import { useGetCourseHook } from '@/hooks/course.hook'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Users, Star } from 'lucide-react'

const CourseSection = ({ ActiveSearch }) => {
  const { data, isLoading } = useGetCourseHook(ActiveSearch)
  const navigate = useNavigate()

  console.log(data)
  const navigateSinglecourse = (id) => {
    navigate(`/singleCourse/${id}`)
  }

  if (isLoading) {
    return (
      <div className='py-20 px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='animate-pulse'>
              <div className='bg-slate-200 h-64 rounded-2xl p-6'>
                <div className='bg-slate-300 h-48 rounded-xl mb-4'></div>
                <div className='h-6 bg-slate-300 rounded-full mb-3'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-slate-300 rounded w-3/4'></div>
                  <div className='h-4 bg-slate-300 rounded w-1/2'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='py-20 px-6 bg-slate-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {data?.courses?.map((item) => (
            <div
              key={item._id}
              onClick={() => navigateSinglecourse(item._id)}
              className='group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl 
                        hover:-translate-y-2 hover:border-slate-300 cursor-pointer transition-all 
                        duration-300 overflow-hidden max-w-sm mx-auto'
            >
              {/* Thumbnail */}
              <div className='relative mb-6'>
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className='w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300'
                />
                <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg'>
                  {item.rating && <><Star className='w-4 h-4 text-yellow-500 fill-current inline mr-1' />
                  <span className='text-sm font-bold text-slate-800'>{item.rating}</span></>}
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className='font-bold text-xl text-slate-900 leading-tight mb-3 line-clamp-2 group-hover:text-slate-700'>
                  {item.title}
                </h3>
                
                <div className='space-y-3 mb-6'>
                  <div className='flex items-center gap-2 text-sm text-slate-600'>
                    <Users className='w-4 h-4' />
                    <span>{item.enrolled ?? 0} students</span>
                  </div>
                  
                  <div className='flex items-center gap-2 text-sm text-slate-600'>
                    <Clock className='w-4 h-4' />
                    <span>{item.duration || 'Duration not specified'}</span>
                  </div>
                  
                  {ActiveSearch && (
                    <div className='inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
                      <span>🔍 {ActiveSearch}</span>
                    </div>
                  )}
                </div>

                <div className='flex items-center justify-between pt-4 border-t border-slate-200'>
                 
                  <button className='px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors group-hover:scale-105'>
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data?.courses?.length === 0 && !isLoading && (
          <div className='text-center py-32'>
            <BookOpen className='w-24 h-24 text-slate-400 mx-auto mb-8' />
            <h2 className='text-2xl font-bold text-slate-900 mb-2'>No courses found</h2>
            <p className='text-slate-600 max-w-md mx-auto text-lg'>
              Try adjusting your search or explore our popular courses below
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseSection
