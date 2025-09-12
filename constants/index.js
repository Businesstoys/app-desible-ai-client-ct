export const CONSTANTS = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    TOKEN_KEY: process.env.NEXT_PUBLIC_TOKEN_KEY,
    MICROSOFT_CLIENT_ID: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID,
    CLIENT_URL: process.env.NEXT_PUBLIC_APP_CLIENT_URL
}

 export const ONGOING_CALL_STATUSES = ['initiate', 'ringing', 'in-progress']

 export const OUTCOMES_DATA = [
    { label: 'All', value: 'All' },
    { label: 'Verified', value: 'Verified' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Review', value: 'Review' },
    { label: 'Rejected', value: 'Rejected' }
  ];

export const STATUS_CONFIG = {
    completed: { variant: "default", className: "bg-green-100 text-sm text-green-600 hover:bg-green-100" },
    'in-progress': { variant: "default", className: "bg-blue-100 text-sm text-blue-500 hover:bg-blue-100" },
    ringing: { variant: "default", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    schedule: { variant: "default", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
    queued: { variant: "default", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
    initiate: { variant: "default", className: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
    busy: { variant: "default", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    'not-reachable': { variant: "default", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    'no-answer': { variant: "default", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    failed: { variant: "destructive", className: "text-sm bg-[#FFDEDE] text-red-500 hover:bg-[#FFDEDE]" },
    cancelled: { variant: "destructive", className: "" },
    'hang-up': { variant: "destructive", className: "" },
  };