import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  Loader2,
  Phone,
  PhoneOff,
  PhoneCall,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Label,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '@/components/ui/chart';

const chartConfig = {
  connected: {
    label: 'Connected Calls',
    color: 'hsl(196, 100%, 28%)',
    icon: Phone,
  },
  notConnected: {
    label: 'Not Connected Calls',
    color: 'hsl(210, 17.5%, 84.31%)',
    icon: PhoneOff,
  },
};

const ChartSkeleton = () => (
  <div className='animate-pulse'>
    <div className='mb-2 h-4 w-1/3 rounded bg-muted'></div>
    <div className='mb-6 h-3 w-1/2 rounded bg-muted/60'></div>
    <div className='space-y-3'>
      <div className='flex items-end space-x-1'>
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className='flex-1 rounded-t bg-muted'
            style={{ height: `${Math.random() * 150 + 50}px` }}
          ></div>
        ))}
      </div>
      <div className='h-8 rounded bg-muted/40'></div>
    </div>
  </div>
);

export default function CallAttemptsChart({ data, loading = false }) {
  const [isLoading] = useState(loading);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='rounded-xl border border-gray-200/60 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-gray-700/60 dark:bg-gray-900/95'>
          <p className='mb-3 font-semibold text-gray-900 dark:text-gray-100'>
            Call Attempt {label}
          </p>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-2'>
                <div
                  className='h-3 w-3 rounded-full shadow-sm'
                  style={{ backgroundColor: '#00698F' }}
                ></div>
                <span className='text-gray-700 dark:text-gray-300'>
                  Connected
                </span>
              </div>
              <span className='font-medium text-gray-900 dark:text-gray-100'>
                {data.connected} ({data.connectedPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-2'>
                <div
                  className='h-3 w-3 rounded-full shadow-sm'
                  style={{ backgroundColor: '#D0D7DE' }}
                ></div>
                <span className='text-gray-700 dark:text-gray-300'>
                  Not Connected
                </span>
              </div>
              <span className='font-medium text-gray-900 dark:text-gray-100'>
                {data.notConnected} ({data.notConnectedPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className='border-t border-gray-200 pt-2 text-xs text-muted-foreground dark:border-gray-700'>
              <span className='font-medium'>Total Calls: {data.total}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className='w-full border-0 bg-gradient-to-br from-white to-gray-50/30 shadow-lg backdrop-blur-sm dark:from-gray-900 dark:to-gray-800/30'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
            <CardTitle>Connection Attempts Analysis</CardTitle>
          </div>
          <CardDescription>Loading call connection data...</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='my-8 w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-3'>
          <div className='rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-100 p-3 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50'>
            <PhoneCall className='h-5 w-5 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-semibold text-transparent dark:from-gray-100 dark:to-gray-300'>
              Call Connection Analysis
            </span>
          </div>
        </CardTitle>
        <CardDescription className='text-muted-foreground/80'>
          Call success rate analysis across {data?.length} connection
          attempts with detailed performance insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-fit max-h-[400px] overflow-hidden rounded-xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/50 p-1 dark:border-gray-700/60 dark:from-gray-900 dark:to-gray-800/50'>
          <ChartContainer config={chartConfig} className='h-fit max-h-[600px]'>
            <ResponsiveContainer width='100%' aspect={3}>
              <BarChart
                layout='vertical'
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap='2%' // 🔥 CHANGED: Much lower percentage
                barGap={2}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  className='stroke-muted/40'
                  vertical={false}
                />
                <XAxis
                  type='number'
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  dataKey='attempt'
                  type='category'
                  width={100}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => `Attempt ${value}`}
                >
                  <Label
                    value='Attempt'
                    angle={-90}
                    position='insideLeft'
                    offset={20}
                    style={{
                      textAnchor: 'middle',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                  />
                </YAxis>
                <ChartTooltip
                  content={<CustomTooltip />}
                  cursor={{ height: 'fit-content' }}
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                />
                <Bar
                  dataKey='connected'
                  stackId='a'
                  fill='var(--color-connected)'
                  radius={[1, 3, 3, 1]}
                  name='Connected Calls'
                  barSize={30}
                />
                <Bar
                  dataKey='notConnected'
                  stackId='a'
                  fill='var(--color-notConnected)'
                  radius={[1, 3, 3, 1]}
                  name='Not Connected Calls'
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
