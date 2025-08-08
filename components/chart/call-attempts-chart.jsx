import React, { useState, useEffect } from "react"
import { TrendingDown, Loader2, Phone, PhoneOff, PhoneCall } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart"

const chartConfig = {
  connected: {
    label: "Connected Calls",
    color: "hsl(142, 69%, 58%)",
    icon: Phone,
  },
  notConnected: {
    label: "Not Connected Calls", 
    color: "hsl(0, 70%, 65%)",
    icon: PhoneOff,
  },
}

const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
    <div className="h-3 bg-muted/60 rounded w-1/2 mb-6"></div>
    <div className="space-y-3">
      <div className="flex items-end space-x-1">
        {Array.from({ length: 15 }, (_, i) => (
          <div 
            key={i}
            className="bg-muted rounded-t flex-1"
            style={{ height: `${Math.random() * 150 + 50}px` }}
          ></div>
        ))}
      </div>
      <div className="h-8 bg-muted/40 rounded"></div>
    </div>
  </div>
)

export default function CallAttemptsChart({ data, loading = false }) {
  const [isLoading] = useState(loading)

  const chartData = data && data.length > 0 ? data : []

  console.log(chartData)

  const totalAttempts = chartData.reduce((sum, item) => sum + item.total, 0)
  const totalConnected = chartData.reduce((sum, item) => sum + item.connected, 0)
  const overallSuccessRate = ((totalConnected / totalAttempts) * 100).toFixed(1)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-xl p-4">
          <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Call Attempt {label}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-sm"></div>
                <span className="text-gray-700 dark:text-gray-300">Connected</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{data.connected} ({data.connectedPercentage.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-rose-500 shadow-sm"></div>
                <span className="text-gray-700 dark:text-gray-300">Not Connected</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{data.notConnected} ({data.notConnectedPercentage.toFixed(1)}%)</span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-muted-foreground">
              <span className="font-medium">Total Calls: {data.total}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <CardTitle>Connection Attempts Analysis</CardTitle>
          </div>
          <CardDescription>Loading call connection data...</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full my-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
            <PhoneCall className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent font-semibold">
              Call Connection Analysis
            </span>
          </div>
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Call success rate analysis across {chartData.length} connection attempts with detailed performance insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 rounded-xl p-1 border border-gray-200/60 dark:border-gray-700/60">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-muted/40" 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="attempt"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  className="text-muted-foreground/70"
                  tickFormatter={(value) => `Attempt ${value}`}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  className="text-muted-foreground/70"
                />
                <ChartTooltip content={<CustomTooltip />} />
                <ChartLegend 
                  content={<ChartLegendContent />}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar
                  dataKey="connected"
                  stackId="a"
                  fill="var(--color-connected)"
                  radius={[0, 0, 6, 6]}
                  name="Connected Calls"
                />
                <Bar
                  dataKey="notConnected"
                  stackId="a"
                  fill="var(--color-notConnected)"
                  radius={[6, 6, 0, 0]}
                  name="Not Connected Calls"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>

    </Card>
  )
}