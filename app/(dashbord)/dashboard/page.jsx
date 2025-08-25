'use client';
import React, { useState, useMemo } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  CalendarDays,
  Phone,
  Clock,
  Users,
  UserCheck,
  CheckCircle,
  Zap,
} from 'lucide-react';

import {
  useCallkpiQuery,
  useGetCallAttemptsQuery,
  useGetCallReportQuery,
  useGetCallStatusReportQuery,
} from '@/store';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import CallAttemptsChart from '@/components/chart/call-attempts-chart';
import CallsReportChart from '@/components/chart/call-status-report-chart';
import TimeHeatmap from '@/components/chart/call-hitmap';

const fmt = (n) => numeral(n).format('0.[0]a');

const formatDuration = (sec = 0) => {
  const d = moment.duration(sec, 'seconds');
  return `${d.minutes()}m ${d.seconds()}s`;
};

const getApiDateRange = (dateRange) => {
  if (!dateRange?.from || !dateRange?.to) return null;

  return {
    from: moment(dateRange.from).format('YYYY-MM-DD'),
    to: moment(dateRange.to).format('YYYY-MM-DD'),
  };
};

const formatDateRange = (dateRange) => {
  if (!dateRange?.from || !dateRange?.to) return 'All Time';
  const from = moment(dateRange.from).format('MMM DD');
  const to = moment(dateRange.to).format('MMM DD, YYYY');
  return `${from} - ${to}`;
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [tempDateRange, setTempDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleApplyDateRange = () => {
    setDateRange(tempDateRange);
    setIsPopoverOpen(false);
  };

  const handleQuickRange = (days) => {
    const to = new Date();
    const from = new Date();

    if (days === 0) {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
    } else {
      from.setDate(from.getDate() - days + 1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
    }

    setTempDateRange({ from, to });
  };

  const clearDateRange = () => {
    setTempDateRange({ from: undefined, to: undefined });
  };

  const handleCancelDateRange = () => {
    setTempDateRange(dateRange);
    setIsPopoverOpen(false);
  };

  const apiDateRange = getApiDateRange(dateRange);
  const apiPayload = apiDateRange ? apiDateRange : {};

  const { data: kpiResponse, isLoading: kpiLoading } =
    useCallkpiQuery(apiPayload);
  const { data: reportResp, isLoading: reportLoading } =
    useGetCallReportQuery(apiPayload);
  const { data: statusResp, isLoading: statusLoading } =
    useGetCallStatusReportQuery(apiPayload);
  const { data: attemptData, isLoading: attemptLoading } =
    useGetCallAttemptsQuery(apiPayload);

  const callStatusData = [
    {
      date: '25 Jul',
      completed: 12,
      failed: 5,
      busy: 3,
      'no-answer': 8,
      'not-reachable': 2,
    },
    {
      date: '26 Jul',
      completed: 18,
      failed: 2,
      busy: 6,
      'no-answer': 12,
      'not-reachable': 5,
    },
    {
      date: '27 Jul',
      completed: 20,
      failed: 3,
      busy: 4,
      'no-answer': 10,
      'not-reachable': 1,
    },
    {
      date: '28 Jul',
      completed: 25,
      failed: 7,
      busy: 5,
      'no-answer': 9,
      'not-reachable': 4,
    },
    {
      date: '29 Jul',
      completed: 30,
      failed: 4,
      busy: 8,
      'no-answer': 7,
      'not-reachable': 6,
    },
    {
      date: '30 Jul',
      completed: 40,
      failed: 10,
      busy: 6,
      'no-answer': 5,
      'not-reachable': 3,
    },
    {
      date: '01 Aug',
      completed: 10,
      failed: 5,
      busy: 2,
      'no-answer': 1,
      'not-reachable': 0,
    },
    {
      date: '01 Aug',
      completed: 20,
      failed: 2,
      busy: 1,
      'no-answer': 3,
      'not-reachable': 1,
    },
    {
      date: '02 Aug',
      completed: 15,
      failed: 4,
      busy: 3,
      'no-answer': 2,
      'not-reachable': 0,
    },
  ];

  const colors = {
    completed: '#10B981',
    failed: '#EF4444',
    busy: '#F59E0B',
    'no-answer': '#6366F1',
    'not-reachable': '#8B5CF6',
  };

  function aggregateByDate(data) {
    const aggregated = {};

    data.forEach((item) => {
      const { date, ...rest } = item;

      if (!aggregated[date]) {
        aggregated[date] = {
          date,
          ...Object.fromEntries(Object.keys(rest).map((k) => [k, 0])),
        };
      }

      Object.keys(rest).forEach((key) => {
        aggregated[date][key] += rest[key];
      });
    });

    return Object.values(aggregated);
  }

  const statusData = aggregateByDate(callStatusData);
  // Get keys except "date"
  const dataKeys =
    statusData.length > 0
      ? Object.keys(statusData[0]).filter((k) => k !== 'date')
      : [];

  console.log(statusData);

  const defaultMetric = { value: 0, trend: '+0%', trendUp: true };
  const tc = kpiResponse?.data?.totalCalls ?? defaultMetric;
  const pr = kpiResponse?.data?.pickupRate ?? defaultMetric;
  const cr = kpiResponse?.data?.connectedRate ?? defaultMetric;
  const cc = kpiResponse?.data?.connectedCalls ?? defaultMetric;
  const ad = kpiResponse?.data?.averageCallDurationSec ?? defaultMetric;
  const tq = kpiResponse?.data?.totalQualifiedLeads ?? defaultMetric;
  const tm = kpiResponse?.data?.totalMinutesConsumed ?? defaultMetric;
  const tr = kpiResponse?.data?.transferRate ?? defaultMetric;
  const fr = kpiResponse?.data?.feedbackRating ?? defaultMetric;
  const er = kpiResponse?.data?.engagementRateTrend ?? defaultMetric;
  const uc = kpiResponse?.data?.uniqueCalls ?? defaultMetric;
  const qr = kpiResponse?.data?.qualificationRate ?? defaultMetric;
  const tcm =
    kpiResponse?.data?.callsMoreThan1MinRateOfConnected ?? defaultMetric;
  const topMetrics = useMemo(
    () => [
      {
        label: 'Total Calls Done',
        value: kpiLoading ? '–' : fmt(tc.value),
        icon: <Phone className='text-blue-800' size={20} />,
        trend: tc.trend,
        trendUp: tc.trendUp,
      },
      {
        label: 'Total Unique Calls',
        value: kpiLoading ? '–' : fmt(uc?.value),
        icon: <UserCheck className='text-blue-500' size={20} />,
        trend: uc?.trend,
        trendUp: uc?.trendUp,
      },
      {
        label: 'Total Connected Calls',
        value: kpiLoading ? '–' : `${fmt(cc.value)}`,
        icon: <Users className='text-emerald-500' size={20} />,
        trend: cc.trend,
        trendUp: cc.trendUp,
      },
    ],
    [kpiLoading, tc, uc, cc],
  );

  const bottomMetrics = useMemo(
    () => [
      {
        label: 'Connected Calls Over 1 Min (%)',
        value: kpiLoading ? '–' : `${fmt(tcm.value)}%`,
        icon: <Users className='text-emerald-500' size={20} />,
        trend: tcm.trend,
        trendUp: tcm.trendUp,
      },
      {
        label: 'Connect Rate',
        value: kpiLoading ? '–' : `${fmt(cr.value)}%`,
        icon: <Users className='text-emerald-500' size={20} />,
        trend: cr.trend,
        trendUp: cr.trendUp,
      },
      {
        label: 'Average Call Duration',
        value: kpiLoading ? '–' : formatDuration(ad.value),
        icon: <Clock className='text-amber-500' size={20} />,
        trend: ad.trend,
        trendUp: ad.trendUp,
      },
      {
        label: 'Total Qualified Leads',
        value: kpiLoading ? '–' : fmt(tq.value),
        icon: <Users className='text-purple-500' size={20} />,
        trend: tq.trend,
        trendUp: tq.trendUp,
      },
      {
        label: 'Qualification Rate',
        value: kpiLoading ? '–' : `${fmt(qr.value)}%`,
        icon: <CheckCircle className='text-green-500' size={20} />,
        trend: qr.trend,
        trendUp: qr.trendUp,
      },
      {
        label: 'Total Minutes Consumed',
        value: kpiLoading ? '–' : fmt(tm.value),
        icon: <Clock className='text-blue-500' size={20} />,
        trend: tm.trend,
        trendUp: tm.trendUp,
      },
    ],
    [kpiLoading, ad, tq, tm, tr, fr, er, qr, tc, pr, cr, cc, uc],
  );

  const chartData = reportLoading ? [] : reportResp?.data || [];
  //   const statusData = statusLoading ? [] : statusResp?.data || [];

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className='rounded-lg border border-gray-100 bg-white p-4 shadow-lg'>
          <p className='font-medium'>{label}</p>
          {payload.map((entry, index) => (
            <p key={`status-${index}`} className='text-sm text-gray-600'>
              <span
                className='mr-2 inline-block h-3 w-3 rounded-sm'
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}: {fmt(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className=''>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
          <div className='flex items-center gap-2'>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='border-gray-200 bg-white hover:bg-gray-50'
                  onClick={() => {
                    setTempDateRange(dateRange);
                    setIsPopoverOpen(true);
                  }}
                >
                  <CalendarDays className='mr-2 h-4 w-4 text-gray-500' />
                  {formatDateRange(dateRange)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='end'>
                <div className='p-4'>
                  <div className='mb-4 flex flex-col gap-2'>
                    <div className='flex flex-wrap gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleQuickRange(0)}
                        className='text-xs'
                      >
                        Today
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleQuickRange(7)}
                        className='text-xs'
                      >
                        Last 7 days
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleQuickRange(30)}
                        className='text-xs'
                      >
                        Last 30 days
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={clearDateRange}
                        className='text-xs'
                      >
                        All Time
                      </Button>
                    </div>
                  </div>
                  <Calendar
                    mode='range'
                    selected={tempDateRange}
                    onSelect={setTempDateRange}
                    numberOfMonths={2}
                    className='rounded-md border'
                  />
                  <div className='mt-4 flex justify-between'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleCancelDateRange}
                    >
                      Cancel
                    </Button>
                    <Button size='sm' onClick={handleApplyDateRange}>
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Card className='mb-8 border-0 shadow-md'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-3'>
              <div className='rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-100 p-3 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-indigo-950/50'>
                <Zap className='h-5 w-5 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-semibold text-transparent dark:from-gray-100 dark:to-gray-300'>
                  Calls KPI
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3'>
              {topMetrics.map((m) => (
                <Card
                  key={m.label}
                  className='border border-gray-100 transition hover:shadow-md'
                >
                  <CardContent className='flex h-28 flex-col justify-center p-5'>
                    <div className='mb-2 flex items-center justify-between'>
                      <div className='flex items-center text-sm font-medium text-gray-600'>
                        <span className='mr-2'>{m.icon}</span>
                        {m.label}
                      </div>
                    </div>
                    <div className='mt-1 text-3xl font-bold text-gray-900'>
                      {m.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              {bottomMetrics.map((m) => (
                <Card
                  key={m.label}
                  className='border border-gray-100 transition hover:shadow-md'
                >
                  <CardContent className='flex h-28 flex-col justify-center p-5'>
                    <div className='mb-2 flex items-center justify-between'>
                      <div className='flex items-center text-sm font-medium text-gray-600'>
                        <span className='mr-2'>{m.icon}</span>
                        {m.label}
                      </div>
                    </div>
                    <div className='mt-1 text-3xl font-bold text-gray-900'>
                      {m.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <CallAttemptsChart
          isLoading={attemptLoading}
          data={attemptData?.data}
        />

        {/* <TimeHeatmap /> */}

        {/* Calls Report */}
        {/* <CallsReportChart data={chartData} loading={reportLoading} /> */}
        {/* Call Status Trend */}
        <Card className='border-0 shadow-md'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl font-semibold text-gray-900'>
              Call Status Trend
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='h-96'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={statusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#f0f0f0'
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey='date'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={fmt}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dx={-10}
                  />
                  <Tooltip
                    content={<CustomLineTooltip />}
                    cursor={{ opacity: 0.1 }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: 10,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  />
                  {/* {console.log("Chart Keys", chartKeys)} */}
                  {dataKeys.map((key, index) => (
                    <Line
                      key={key}
                      type='monotone'
                      dataKey={key}
                      name={key
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())} // Pretty labels
                       stroke={colors[key] || "#3B82F6"}
                      strokeWidth={2.5}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>

              {/* <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={callStatusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#f0f0f0'
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey='date'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    dx={-10}
                  />
                  <Tooltip />
                  <Legend />

                  <Line
                    type='monotone'
                    dataKey='completed'
                    name='Completed'
                    stroke='#10B981'
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='failed'
                    name='Failed'
                    stroke='#EF4444'
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='busy'
                    name='Busy'
                    stroke='#F59E0B'
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='no-answer'
                    name='No Answer'
                    stroke='#6366F1'
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='not-reachable'
                    name='Not Reachable'
                    stroke='#8B5CF6'
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
