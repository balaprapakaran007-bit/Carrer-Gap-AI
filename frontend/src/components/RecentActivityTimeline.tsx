import React, { useState } from 'react';
import {
  CheckCircle2, Sparkles, AlertTriangle, Clock
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
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />;
      case 'gap': return <AlertTriangle className="w-4 h-4 text-[#D97706]" />;
      default: return <Sparkles className="w-4 h-4 text-[#F97316]" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white space-y-6 shadow-sm">
      
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
            Activity Audit
          </span>
          <h3 className="text-base font-bold text-[#1C1917] mt-0.5">Recent Career Activity</h3>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'skills', 'analyses', 'projects', 'resume'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold capitalize transition cursor-pointer ${
                filter === cat
                  ? 'bg-[#F97316] text-white shadow-sm'
                  : 'bg-[#FAFAFA] text-[#78716C] hover:text-[#1C1917] border border-[#E7E5E4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#FAFAFA] transition">
            <div className="mt-0.5 p-2 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] shrink-0">
              {getStatusIcon(item.status)}
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-[#1C1917] truncate">{item.title}</h4>
                <span className="text-[10px] text-[#78716C] shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </span>
              </div>
              <p className="text-xs text-[#78716C] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
