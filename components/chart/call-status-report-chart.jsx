import React, { useState, useEffect } from "react"
import { TrendingUp, Loader2, PhoneCall, CheckCircle, BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  callsTriggered: {
    label: "Calls Triggered",
    color: "hsl(217, 91%, 60%)",
    icon: PhoneCall,
  },
  qualifiedCalls: {
    label: "Qualified Calls",
    color: "hsl(238, 77%, 68%)",
    icon: CheckCircle,
  },
}

// Loading skeleton component
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
    <div className="h-3 bg-muted/60 rounded w-1/2 mb-6"></div>
    <div className="space-y-3">
      <div className="flex items-end space-x-2">
        {Array.from({ length: 13 }, (_, i) => (
          <div 
            key={i}
            className="bg-muted rounded-t flex-1"
            style={{ height: `${Math.random() * 200 + 80}px` }}
          ></div>
        ))}
      </div>
      <div className="h-8 bg-muted/40 rounded"></div>
    </div>
  </div>
)

export default function CallsReportChart({ data, loading = false }) {
  const chartData = data && data.length > 0 ? data : []

  const totalTriggered = chartData.reduce((sum, item) => sum + item.callsTriggered, 0)
  const totalQualified = chartData.reduce((sum, item) => sum + item.qualifiedCalls, 0)
  const qualificationRate = ((totalQualified / totalTriggered) * 100).toFixed(1)
  const peakDay = chartData.reduce((max, item) => 
    item.callsTriggered > max.callsTriggered ? item : max, chartData[0]
  )

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const qualificationPercent = data.callsTriggered > 0 
        ? ((data.qualifiedCalls / data.callsTriggered) * 100).toFixed(1)
        : 0

      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-xl p-4">
          <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100">{label}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-sm"></div>
                <span className="text-gray-700 dark:text-gray-300">Calls Triggered</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{data.callsTriggered.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 shadow-sm"></div>
                <span className="text-gray-700 dark:text-gray-300">Qualified Calls</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{data.qualifiedCalls.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-muted-foreground">
              <span className="font-medium">Qualification Rate: {qualificationPercent}%</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <CardTitle>Calls Report</CardTitle>
          </div>
          <CardDescription>Loading call performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full my-8 shadow-md border-0 bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent font-semibold">
              Daily Calls Report
            </span>
          </div>
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Comprehensive analysis of triggered vs qualified calls over time with performance insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 rounded-xl p-1 border border-gray-200/60 dark:border-gray-700/60">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={36} barGap={6}>
                <defs>
                  <linearGradient id="colorTriggered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="hsl(217, 91%, 75%)" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(238, 77%, 68%)" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="hsl(238, 77%, 80%)" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-muted/40" 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  className="text-muted-foreground/70"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  className="text-muted-foreground/70"
                  tickFormatter={formatNumber}
                />
                <ChartTooltip content={<CustomTooltip />} />
                <ChartLegend 
                  content={<ChartLegendContent />}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar
                  dataKey="callsTriggered"
                  name="Calls Triggered"
                  fill="url(#colorTriggered)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="qualifiedCalls"
                  name="Qualified Calls"
                  fill="url(#colorQualified)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}