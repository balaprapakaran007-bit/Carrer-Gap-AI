import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { InterviewSessionModel, InterviewQuestionItem } from '../types';
import {
  Mic, Sparkles, CheckCircle2, ArrowLeft, Send, RefreshCw,
  Award, Layers, Check, ChevronRight
} from 'lucide-react';

export const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<InterviewSessionModel | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initInterview = async () => {
      try {
        setLoading(true);
        let data: InterviewSessionModel;
        try {
          data = await api.getInterviewSession(id || 'demo-analysis-ml-01');
        } catch {
          data = await api.generateInterviewSession({
            analysisId: id || 'demo-analysis-ml-01',
            roleTitle: 'Machine Learning Engineer',
            matchedSkills: ['Python', 'SQL', 'PyTorch'],
            gapSkills: ['Docker', 'FastAPI', 'AWS']
          });
        }
        setSession(data);
        if (data.questions.length > 0) {
          setUserAnswer(data.questions[0].userAnswer || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initInterview();
  }, [id]);

  const handleSelectQuestion = (idx: number) => {
    setActiveQuestionIdx(idx);
    if (session && session.questions[idx]) {
      setUserAnswer(session.questions[idx].userAnswer || '');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !userAnswer.trim()) return;
    const currentQ = session.questions[activeQuestionIdx];
    setIsSubmitting(true);
    try {
      const evaluatedQ = await api.submitInterviewAnswer(
        session.id,
        currentQ.id,
        userAnswer
      );

      setSession((prev: InterviewSessionModel | null) => {
        if (!prev) return null;
        const updatedQuestions = [...prev.questions];
        updatedQuestions[activeQuestionIdx] = evaluatedQ;
        const answeredCount = updatedQuestions.filter((q: InterviewQuestionItem) => !!q.userAnswer).length;
        return {
          ...prev,
          questions: updatedQuestions,
          completedQuestionsCount: answeredCount
        };
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 flex items-center justify-center text-[#F97316] mx-auto animate-spin">
            <Sparkles className="w-5 h-5 fill-[#F97316]" />
          </div>
          <p className="text-xs text-[#78716C] font-mono">Generating Role-Tailored Interview Questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = session?.questions[activeQuestionIdx];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 selection:bg-[#FFF3E8] selection:text-[#F97316] bg-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/analysis/${id || 'demo-analysis-ml-01'}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Analysis</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] flex items-center gap-2.5">
              <Mic className="w-6 h-6 text-[#F97316]" />
              <span>Role-Tailored Mock Interview Simulator</span>
            </h1>
          </div>
          <p className="text-xs text-[#78716C] mt-1">
            Practice technical deep-dives on your matched strengths and defend questions targeting your identified gaps.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-[#FFF3E8] border border-[#F97316]/20 text-[#F97316] text-xs font-bold font-mono">
          {session?.completedQuestionsCount || 0} of {session?.questions.length || 0} Questions Evaluated
        </div>
      </div>

      {/* Main Interview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Questions List */}
        <div className="p-5 rounded-3xl border border-[#E7E5E4] bg-white shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C] px-1">
            Interview Questions ({session?.questions.length || 0})
          </h3>

          <div className="space-y-2">
            {session?.questions.map((q: InterviewQuestionItem, idx: number) => {
              const isCurrent = idx === activeQuestionIdx;
              const hasAnswered = !!q.userAnswer;

              return (
                <button
                  key={q.id || idx}
                  onClick={() => handleSelectQuestion(idx)}
                  className={`w-full p-3.5 rounded-xl text-left transition border cursor-pointer ${
                    isCurrent
                      ? 'bg-[#FFF3E8] border-[#F97316]/40 text-[#1C1917] shadow-sm'
                      : 'bg-[#FAFAFA] border-[#E7E5E4] text-[#78716C] hover:border-[#F97316]/40 hover:text-[#1C1917]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-[#F97316]">Q{idx + 1} • {q.category.split('(')[0]}</span>
                    {hasAnswered && (
                      <span className="flex items-center gap-1 text-[10px] text-[#16A34A] font-semibold">
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
            <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white shadow-sm space-y-6">
              
              {/* Question Header */}
              <div className="space-y-3 pb-4 border-b border-[#E7E5E4]">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/20">
                    {currentQuestion.category}
                  </span>
                  <span className="text-xs font-semibold text-[#78716C]">
                    Target Skill: <strong className="text-[#1C1917]">{currentQuestion.targetedSkill}</strong>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1C1917] leading-relaxed">
                  "{currentQuestion.question}"
                </h3>

                {currentQuestion.expectedKeyPoints && (
                  <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                      Interviewer Evaluation Expectations:
                    </span>
                    <ul className="text-xs text-[#1C1917] space-y-1 pt-1 list-disc list-inside">
                      {currentQuestion.expectedKeyPoints.map((pt: string, pIdx: number) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Answer Box */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">
                  Your Response
                </label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your structured answer here. Include concrete examples, tools used, and measurable results..."
                  className="w-full p-4 rounded-2xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#F97316] focus:bg-white transition leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#78716C] font-mono">
                    {userAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !userAnswer.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
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
                <div className="p-5 rounded-2xl border border-[#E7E5E4] bg-[#FAFAFA] space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
                    <span className="text-xs font-bold text-[#F97316] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 fill-[#F97316]" />
                      <span>AI Rubric Evaluation Results</span>
                    </span>
                    <span className="text-sm font-black text-[#1C1917] font-mono">
                      Overall Score: {currentQuestion.totalScore}/5.0
                    </span>
                  </div>

                  {/* 3 Rubric Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-white border border-[#E7E5E4]">
                      <span className="text-[10px] text-[#78716C] uppercase font-bold">Relevance</span>
                      <div className="text-base font-bold text-[#F97316] mt-0.5">{currentQuestion.scoreRelevance}/5</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E7E5E4]">
                      <span className="text-[10px] text-[#78716C] uppercase font-bold">Depth</span>
                      <div className="text-base font-bold text-[#F97316] mt-0.5">{currentQuestion.scoreDepth}/5</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E7E5E4]">
                      <span className="text-[10px] text-[#78716C] uppercase font-bold">Clarity</span>
                      <div className="text-base font-bold text-[#16A34A] mt-0.5">{currentQuestion.scoreClarity}/5</div>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#1C1917]">Actionable Feedback:</span>
                    <p className="text-xs text-[#1C1917] leading-relaxed bg-white p-3 rounded-xl border border-[#E7E5E4]">
                      {currentQuestion.aiFeedback}
                    </p>
                  </div>

                  {/* Improved Snippet */}
                  {currentQuestion.betterAnswerSnippet && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-[#F97316]">Model Answer Level-Up Example:</span>
                      <p className="text-xs italic text-[#1C1917] bg-white p-3 rounded-xl border-l-2 border-[#F97316]">
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
