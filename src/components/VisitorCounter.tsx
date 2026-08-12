import React, { useEffect, useState } from 'react';
import { Users, Eye, Activity } from 'lucide-react';
import { VisitorStats } from '../types';

export const VisitorCounter: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisits: 14820,
    activeToday: 384
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const hasVisited = sessionStorage.getItem('navquant_visited');
        const endpoint = hasVisited ? '/api/visitors' : '/api/visitors/increment';

        const res = await fetch(endpoint, { method: hasVisited ? 'GET' : 'POST' });
        if (res.ok) {
          const data: VisitorStats = await res.json();
          setStats(data);
          sessionStorage.setItem('navquant_visited', 'true');
        }
      } catch (err) {
        console.warn('Visitor counter fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    trackVisit();
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl shadow-sm transition-colors text-xs">
      <div className="flex items-center gap-1.5 text-teal-400 font-medium">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <Users className="w-3.5 h-3.5 text-teal-400" />
        <span className="font-bold font-mono text-slate-200">
          {stats.totalVisits.toLocaleString('en-IN')}
        </span>
        <span className="text-slate-400 text-[11px]">Visitors</span>
      </div>

      <span className="text-slate-700">|</span>

      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
        <Activity className="w-3 h-3 text-emerald-400" />
        <span className="text-emerald-400 font-bold font-mono">{stats.activeToday}</span>
        <span>Active Today</span>
      </div>
    </div>
  );
};
