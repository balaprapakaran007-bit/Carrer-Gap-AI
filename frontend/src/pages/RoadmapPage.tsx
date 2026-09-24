import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RoadmapStepItem } from '../types';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { MapPin, Sparkles, ArrowLeft, Flame, Award } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [steps, setSteps] = useState<RoadmapStepItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const data = await api.getRoadmap(id || 'demo-analysis-ml-01');
        setSteps(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRoadmap();
  }, [id]);

  const handleToggleStep = async (stepId: string, isCompleted: boolean) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, isCompleted } : s))
    );
    try {
      await api.toggleRoadmapStep(id || 'demo-analysis-ml-01', stepId, isCompleted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 selection:bg-blue-500 selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/analysis/${id || 'demo-analysis-ml-01'}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Analysis</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-blue-400" />
            <span>Personalized Career Roadmap</span>
          </h1>
          <p className="text-xs text-slate-400">
            Step-by-step milestone execution with verified learning resources and practical implementation tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>5-Day Streak Active</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-mono">Loading Roadmap Milestones...</div>
      ) : (
        <RoadmapTimeline steps={steps} onToggleStep={handleToggleStep} />
      )}
    </div>
  );
};
