import { useCreateCouseHook, useGetCourseHook } from '@/hooks/course.hook'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const DashboardProducts = () => {
  const { data } = useGetCourseHook()
  const navigate = useNavigate()
  const { register, handleSubmit, reset: resetForm } = useForm()
  const { mutate, isPending } = useCreateCouseHook()
  const [openModule, setOpenModule] = useState(false)

  const getCourseId = (id) => {
    navigate(`/dashboard/CourseModule/${id}`)
  }

  const createCourseHandler = (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('amount', data.amount)
    formData.append('thumbnail', data.thumbnail[0])

    mutate(formData, {
      onSuccess: (res) => {
        toast.success(res.message)
        setOpenModule(false)
        resetForm()
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-8 lg:p-10 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div><p className="eyebrow mb-2">Catalog management</p><h1 className="font-display text-3xl font-extrabold text-gray-900">Courses</h1></div>

        <Dialog open={openModule} onOpenChange={setOpenModule}>
          <DialogTrigger
            disabled={isPending}
            className="px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg"
          >
            + Add Course
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                <form
                  onSubmit={handleSubmit(createCourseHandler)}
                  className="mt-6 space-y-5"
                >
                  <input
                    {...register("title")}
                    placeholder="Course Title"
                    className="w-full p-3.5 border rounded-xl bg-[#fcfaf6] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <textarea
                    {...register("description")}
                    placeholder="Course Description"
                    rows={3}
                    className="w-full p-3.5 border rounded-xl bg-[#fcfaf6] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <input
                    type="number"
                    {...register("amount")}
                    placeholder="Price"
                    className="w-full p-3.5 border rounded-xl bg-[#fcfaf6] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    {...register("thumbnail")}
                    className="w-full rounded-xl border border-dashed border-[#d8cdbf] p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#f1e2d8] file:px-3 file:py-2 file:text-[#6f3c2c]"
                  />

                  <button
                    disabled={isPending}
                    type="submit"
                    className="w-full py-3 bg-emerald-600 flex items-center justify-center text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                  >
                    {isPending ? <Spinner /> : "Create Course"}
                  </button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.courses?.map((item) => (
          <div
            key={item._id}
            onClick={() => getCourseId(item._id)}
            className="lift-card cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 group"
          >
            <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-full object-contain group-hover:scale-105 transition"
              />
            </div>

            <div className="mt-4">
              <h2 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-3 font-bold text-emerald-600">
                ₹ {item.amount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardProducts
