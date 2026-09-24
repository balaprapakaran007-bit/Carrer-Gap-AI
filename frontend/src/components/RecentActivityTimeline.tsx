import React, { useState } from 'react';
import {
  CheckCircle2, Sparkles, AlertTriangle, FileText, Layers, Clock, Filter
} from 'lucide-react';

interface ActivityItem {
  id: string;
  category: 'skills' | 'analyses' | 'projects' | 'resume';
  title: string;
  time: string;
  status: 'completed' | 'gap' | 'info';
  desc: string;
}

export const RecentActivityTimeline: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'skills' | 'analyses' | 'projects' | 'resume'>('all');

  const activities: ActivityItem[] = [
    {
      id: 'act-1',
      category: 'skills',
      title: 'Completed Python & PyTorch Roadmap Milestone',
      time: '2 hours ago',
      status: 'completed',
      desc: 'Deep learning pipeline training milestone verified (+4 pts).'
    },
    {
      id: 'act-2',
      category: 'analyses',
      title: 'Analyzed Machine Learning Engineer Position',
      time: '1 day ago',
      status: 'info',
      desc: 'Extracted 12 matched skills, 4 missing requirements, and 3 weak evidence citations.'
    },
    {
      id: 'act-3',
      category: 'projects',
      title: 'Generated Project Spec: Containerized RAG API',
      time: '2 days ago',
      status: 'info',
      desc: 'Designed architectural plan to close Docker and FastAPI gaps simultaneously.'
    },
    {
      id: 'act-4',
      category: 'skills',
      title: 'Docker Missing Requirement Identified',
      time: '2 days ago',
      status: 'gap',
      desc: 'High-priority containerization gap detected for ML production microservices.'
    },
    {
      id: 'act-5',
      category: 'resume',
      title: 'Updated Resume Version 1.2',
      time: '3 days ago',
      status: 'completed',
      desc: 'Quantified ETL data pipeline bullets with 500k+ records throughput metrics.'
    }
  ];

  const filtered = activities.filter(a => filter === 'all' || a.category === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'gap': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6 shadow-xl">
      
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Activity Audit
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">Recent Career Activity</h3>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'skills', 'analyses', 'projects', 'resume'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold capitalize transition cursor-pointer ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="font-bold text-slate-100">{item.title}</span>
                </div>
                <span className="text-[10px] text-slate-500">{item.time}</span>
              </div>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
