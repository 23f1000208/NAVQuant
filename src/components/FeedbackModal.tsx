import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageCircle,
  Sparkles,
  User,
  Tag,
  Clock
} from 'lucide-react';
import { StarRating } from './StarRating';
import { UserFeedbackInput, UserFeedbackItem } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<UserFeedbackInput['category']>('General');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [comments, setComments] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [recentFeedbacks, setRecentFeedbacks] = useState<UserFeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'reviews'>('form');

  useEffect(() => {
    if (isOpen) {
      fetchFeedbacks();
    }
  }, [isOpen]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setRecentFeedbacks(data);
      }
    } catch (err) {
      console.warn('Failed to fetch recent feedbacks:', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category,
          name: name.trim() || 'Anonymous Investor',
          email: email.trim(),
          comments: comments.trim()
        })
      });

      if (res.ok) {
        setSubmitted(true);
        fetchFeedbacks();
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Feedback submit error:', err);
      alert('Network error submitting feedback.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setComments('');
    setRating(5);
  };

  // Average Rating calculation
  const avgRating =
    recentFeedbacks.length > 0
      ? (recentFeedbacks.reduce((acc, f) => acc + f.rating, 0) / recentFeedbacks.length).toFixed(1)
      : '5.0';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Investor Feedback & Reviews
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/50">
                  ★ {avgRating} Avg Rating
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Help us improve NAV Quant PRO models, UI, & fund comparison algorithms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'form'
                ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Community Feedback ({recentFeedbacks.length})
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'form' ? (
            submitted ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Thank You For Your Feedback!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your insights directly help our quantitative researchers and developers refine rolling return formulas, fund classification, and user experience.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                  >
                    Submit Another Feedback
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs font-semibold px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors"
                  >
                    View Community Reviews
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Input */}
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-center space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    How would you rate your experience with NAV Quant PRO?
                  </label>
                  <div className="flex justify-center py-1">
                    <StarRating
                      rating={rating}
                      size="lg"
                      interactive
                      onChange={(newRating) => setRating(newRating)}
                      showScore
                    />
                  </div>
                  <p className="text-[11px] text-amber-300/80 font-medium">
                    {rating === 5
                      ? ' Outstanding - Extremely Satisfied'
                      : rating === 4
                      ? ' Very Good - Highly Satisfied'
                      : rating === 3
                      ? ' Good - Average Experience'
                      : rating === 2
                      ? ' Needs Improvement'
                      : ' Poor Experience'}
                  </p>
                </div>

                {/* Category & Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">
                      Feedback Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as UserFeedbackInput['category'])
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="General">General Feedback</option>
                      <option value="Quant Model Accuracy">Quant Model / Rolling CAGR Accuracy</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="User Interface">User Interface / Layout</option>
                      <option value="Bug Report">Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1 block">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">
                    Comments & Detailed Feedback <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    placeholder="Tell us what features you loved, what fund metrics you want to see, or any issues experienced..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !comments.trim()}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-950/30 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Submitting Feedback...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Feedback
                    </>
                  )}
                </button>
              </form>
            )
          ) : (
            /* Reviews & Community Feedback Tab */
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Community Ratings Overview</h4>
                  <p className="text-[11px] text-slate-400">
                    Based on verified user feedback from mutual fund investors and advisors.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-amber-400 font-mono">{avgRating} / 5</p>
                  <StarRating rating={Number(avgRating)} size="sm" />
                </div>
              </div>

              <div className="space-y-3">
                {recentFeedbacks.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                          {item.name ? item.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{item.name}</p>
                          <span className="text-[10px] text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/40">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <StarRating rating={item.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/50">
                      "{item.comments}"
                    </p>
                    <p className="text-[10px] text-slate-500 text-right">
                      {new Date(item.timestamp).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
