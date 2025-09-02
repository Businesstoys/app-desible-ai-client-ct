'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import api from '@/store/api';


function useGlobalNetworkActivity() {
  const reducerPath = api.reducerPath;

  return useSelector((state) => {
    const apiState = state?.[reducerPath] || {};
    const queries = apiState.queries || {};
    const mutations = apiState.mutations || {};

    const fetching = Object.values(queries).reduce(
      (sum, q) => sum + (q?.status === 'pending' ? 1 : 0),
      0
    );

    const mutating = Object.values(mutations).reduce(
      (sum, m) => sum + (m?.status === 'pending' ? 1 : 0),
      0
    );

    return { fetching, mutating, active: fetching + mutating > 0 };
  });
}

export default function TopLoader() {
  const { active } = useGlobalNetworkActivity();

  if (!active) return null;

  return (
    <>
      <div className="fixed left-0 top-0 h-1 w-full overflow-hidden z-[9999]">
        <div
          className="h-full w-1/3 animate-[progress_1.2s_ease-in-out_infinite]"
          style={{ background: 'linear-gradient(to right, #60a5fa, #3b82f6)' }}
        />
      </div>
      <style jsx global>{`
        @keyframes progress {
          0% { margin-left: -33%; }
          50% { margin-left: 50%; }
          100% { margin-left: 100%; }
        }
      `}</style>
    </>
  );
}