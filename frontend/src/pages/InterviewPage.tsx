import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { InterviewSessionModel, InterviewQuestionItem } from '../types';
import {
  Mic, Sparkles, Send, CheckCircle2, Star, ArrowRight, ArrowLeft,
  RefreshCw, MessageSquare, AlertCircle, HelpCircle
} from 'lucide-react';

export const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<InterviewSessionModel | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await api.getInterviewSession(id || 'demo-analysis-ml-01');
        setSession(data);
        if (data.questions && data.questions.length > 0) {
          setUserAnswer(data.questions[0].userAnswer || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, [id]);

  const handleSelectQuestion = (idx: number) => {
    setActiveQuestionIdx(idx);
    if (session?.questions[idx]) {
      setUserAnswer(session.questions[idx].userAnswer || '');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !userAnswer.trim()) return;
    const currentQ = session.questions[activeQuestionIdx];
    setIsSubmitting(true);
    try {
      const res = await api.submitInterviewAnswer(session.id, currentQ.id, userAnswer);
      // Update local state
      setSession((prev) => {
        if (!prev) return prev;
        const updatedQs = [...prev.questions];
        updatedQs[activeQuestionIdx] = res.question;
        return { ...prev, questions: updatedQs, completedQuestionsCount: res.sessionCompletedCount };
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto animate-spin">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-mono">Generating Role-Tailored Interview Questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = session?.questions[activeQuestionIdx];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 selection:bg-purple-500 selection:text-white">
      
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <Mic className="w-6 h-6 text-purple-400" />
              <span>Role-Tailored Mock Interview Simulator</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Practice technical deep-dives on your matched strengths and defend questions targeting your identified gaps.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
          {session?.completedQuestionsCount || 0} of {session?.questions.length || 0} Questions Evaluated
        </div>
      </div>

      {/* Main Interview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Questions List */}
        <div className="p-5 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Interview Questions ({session?.questions.length || 0})
          </h3>

          <div className="space-y-2">
            {session?.questions.map((q, idx) => {
              const isCurrent = idx === activeQuestionIdx;
              const hasAnswered = !!q.userAnswer;

              return (
                <button
                  key={q.id || idx}
                  onClick={() => handleSelectQuestion(idx)}
                  className={`w-full p-3.5 rounded-xl text-left transition border cursor-pointer ${
                    isCurrent
                      ? 'bg-purple-600/15 border-purple-500/40 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-purple-400">Q{idx + 1} • {q.category.split('(')[0]}</span>
                    {hasAnswered && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {q.totalScore ? `${q.totalScore}/5` : 'Scored'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{q.question}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Question Details, Answer Box & AI Rubric Scoring */}
        <div className="lg:col-span-2 space-y-6">
          {currentQuestion && (
            <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6">
              
              {/* Question Header */}
              <div className="space-y-3 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {currentQuestion.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Target Skill: <strong className="text-white">{currentQuestion.targetedSkill}</strong>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-relaxed">
                  "{currentQuestion.question}"
                </h3>

                {currentQuestion.expectedKeyPoints && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Interviewer Evaluation Expectations:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 pt-1 list-disc list-inside">
                      {currentQuestion.expectedKeyPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Answer Box */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Your Response
                </label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your structured answer here. Include concrete examples, tools used, and measurable results..."
                  className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {userAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !userAnswer.trim()}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-500/20"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Rubric...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit & Get AI Rubric Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Rubric Feedback Card (If evaluated) */}
              {currentQuestion.aiFeedback && (
                <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/15 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>AI Rubric Evaluation Results</span>
                    </span>
                    <span className="text-sm font-black text-white">
                      Overall Score: {currentQuestion.totalScore}/5.0
                    </span>
                  </div>

                  {/* 3 Rubric Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Relevance</span>
                      <div className="text-base font-bold text-blue-400 mt-0.5">{currentQuestion.scoreRelevance}/5</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Depth</span>
                      <div className="text-base font-bold text-purple-400 mt-0.5">{currentQuestion.scoreDepth}/5</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Clarity</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{currentQuestion.scoreClarity}/5</div>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300">Actionable Feedback:</span>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      {currentQuestion.aiFeedback}
                    </p>
                  </div>

                  {/* Improved Snippet */}
                  {currentQuestion.betterAnswerSnippet && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-purple-300">Model Answer Level-Up Example:</span>
                      <p className="text-xs italic text-slate-300 bg-slate-950/80 p-3 rounded-xl border-l-2 border-purple-500">
                        "{currentQuestion.betterAnswerSnippet}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
