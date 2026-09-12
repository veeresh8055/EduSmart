import { useGetDailyData, useGetDataHook } from '@/hooks/analytic.hook'
import React, { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const DashboardAnalytics = () => {
  const { data } = useGetDataHook()

  const { startDate, endDate } = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6); // last 7 days
    const toStr = (d) => d.toISOString().split('T')[0]

    return {
      startDate: toStr(start),
      endDate: toStr(end),
    }
  }, [])

  const { data: dailyData, isLoading } = useGetDailyData(startDate, endDate)

  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-8 lg:p-10 space-y-8 page-enter">
      {/* Page Header */}
      <div>
        <p className="eyebrow mb-2">Admin workspace</p><h1 className="font-display text-3xl font-extrabold text-gray-900">Analytics overview</h1>
        <p className="text-gray-500 mt-1">
          Track platform performance & revenue
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Courses" value={data?.courses} />
        <StatCard title="Enrollments" value={data?.totalEntrollments} />
        <StatCard title="Revenue" value={`₹ ${data?.totalRevenue}`} />
        <StatCard title="Users" value={data?.users} />
      </div>

      {/* Chart Section */}
      <div className="surface-card rounded-3xl p-5 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Revenue Trend
            </h2>
            <p className="text-sm text-gray-500">
              Last 7 days performance
            </p>
          </div>
        </div>

        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <div className="h-[55vh]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData || []}>
                <CartesianGrid stroke="#e6ded2" strokeDasharray="3 6" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₹ ${value}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#9b5f47"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardAnalytics


const StatCard = ({ title, value }) => (
  <div className="surface-card lift-card rounded-2xl p-5 sm:p-6">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold text-gray-900 mt-2">
      {value ?? '-'}
    </h2>
  </div>
)

const ChartSkeleton = () => (
  <div className="h-[55vh] flex items-center justify-center">
    <div className="animate-pulse w-full h-full bg-gray-100 rounded-xl" />
  </div>
)
