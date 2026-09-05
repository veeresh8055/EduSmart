import { useGetPurchaseCourse } from '@/hooks/course.hook'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useModuleStores } from '@/Store/module.store'
import { useGetComment } from '@/hooks/module.hook'
import { useForm } from 'react-hook-form'
import { useCreateComment } from '@/hooks/comment.hook'
import { useCheckQuiz, useCreateQuiz } from '@/hooks/quiz.hook'
import { MessageCircle, Send, PlayCircle, FileQuestion } from 'lucide-react'
import { toast } from 'sonner'

const SinglePurchasedCourse = () => {
  const { register, handleSubmit, reset } = useForm()
  const navigate = useNavigate()

  const { setModule, module } = useModuleStores()
  const { id } = useParams()
  const { data } = useGetPurchaseCourse(id)
  
  const { data: getCommentsData } = useGetComment(module?._id)
  const { data: CheckQuiz } = useCheckQuiz(module?._id)

  const getQuizHandler = (quizId) => {
    navigate(`/quiz/${quizId}`)
  }

  const { mutate: createQuiz } = useCreateQuiz()
  const createQuizHandler = (moduleData) => {
    createQuiz(
      {
        moduleId: moduleData._id,
        content: moduleData.title
      },
      {
        onSuccess: () => toast.success('Quiz created successfully!')
      }
    )
  }

  const videoHandler = (moduleData) => {
    setModule(moduleData)
  }

  const { mutate } = useCreateComment()
  const commentHandler = (data) => {
    mutate(
      {
        id: module?._id,
        payload: data
      },
      {
        onSuccess: () => {
          reset()
          toast.success('Comment posted!')
        }
      }
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left - Video & Comments */}
      <div className="w-1/2 flex flex-col border-r border-slate-200">
        {/* Video Player */}
        <div className="h-[50%] bg-slate-900 flex items-center justify-center">
          {module?.video ? (
            <video 
              className="h-full w-full object-contain" 
              src={module.video}
              controls
            />
          ) : (
            <div className="text-center text-slate-400">
              <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">Select a module to watch</p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Comments Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-bold text-slate-900">Comments</h2>
              <span className="text-sm text-slate-500">
                ({getCommentsData?.length || 0})
              </span>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {getCommentsData?.length ? (
              getCommentsData.map((item, index) => (
                <div key={item._id || index} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-slate-900 text-sm leading-relaxed">
                    {item.comment}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">
                      {item.user?.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500">No comments yet</p>
                <p className="text-sm text-slate-400">Be the first to comment!</p>
              </div>
            )}
          </div>

          {/* Comment Form */}
          <div className="px-6 py-4 border-t border-slate-200 bg-white">
            <form onSubmit={handleSubmit(commentHandler)} className="flex gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                {...register('comment', { required: true })}
              />
              <button
                type="submit"
                disabled={!module?._id}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right - Modules */}
      <div className="w-1/2 bg-white overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h2>
          
          <div className="space-y-3">
            {data?.modules?.map((item, index) => (
              <Accordion key={item._id || index} type="single" collapsible>
                <AccordionItem 
                  value={`item-${index}`} 
                  className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all"
                >
                  <AccordionTrigger 
                    onClick={() => videoHandler(item)}
                    className="px-5 py-4 bg-white hover:bg-slate-50 text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-bold text-slate-700">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-slate-900">{item.title}</span>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-5 py-4 bg-slate-50 border-t border-slate-200">
                    <div className="flex gap-3">
                      {/* Create Quiz Button */}
                      {!item.quiz ? (
                        <button
                          onClick={() => createQuizHandler(item)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
                        >
                          <FileQuestion className="w-4 h-4" />
                          Create Quiz
                        </button>
                      ) : (
                        <button
                          onClick={() => getQuizHandler(item.quiz)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
                        >
                          <FileQuestion className="w-4 h-4" />
                          Take Quiz
                        </button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePurchasedCourse