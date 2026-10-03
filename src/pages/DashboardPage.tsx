import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { productApi, adApi } from '../services/api.js';
import { DashboardStats, Advertisement } from '../types/index.js';
import { 
  Wand2, 
  Package, 
  History, 
  FileText, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  ChevronRight,
  Database,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface DashboardPageProps {
  navigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await adApi.getDashboardStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard stats:', err);
      setError('Failed to fetch dashboard statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      setError(null);
      const res = await productApi.seedSampleData();
      if (res.success) {
        setSeedNotice(res.message);
        await loadDashboard();
        setTimeout(() => setSeedNotice(null), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to seed sample data.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8">
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-50 via-white to-indigo-50/70 border border-purple-200/80 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Creator'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Turn your product specifications into high-converting, platform-tailored ad campaigns powered by Gemini AI.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
              title="Populate account with sample products and campaigns"
            >
              {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5 text-purple-600" />}
              <span>{isSeeding ? 'Seeding...' : 'Load Sample Data'}</span>
            </button>

            <button
              onClick={() => navigate('/generator')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate New Ad</span>
            </button>
          </div>
        </div>
      </div>

      {seedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{seedNotice}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Key Metrics - Compact Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Total Ads */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saved Advertisements</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-purple-600" /> : stats?.totalAds || 0}
            </div>
            <div className="text-[11px] text-purple-600 font-medium">Campaign packages</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Total Products */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Product Library</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-purple-600" /> : stats?.totalProducts || 0}
            </div>
            <div className="text-[11px] text-indigo-600 font-medium">Active specifications</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Quick Navigation */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Campaign Archive</div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 mt-1.5 flex items-center gap-1 cursor-pointer"
            >
              <span>Browse All Campaigns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Quick Action Navigation Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <button
          onClick={() => navigate('/generator')}
          className="p-3 rounded-xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
              Ad Generator
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">Prompt Gemini with specs</p>
        </button>

        <button
          onClick={() => navigate('/products')}
          className="p-3 rounded-xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
              Manage Products
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">Catalog specifications</p>
        </button>

        <button
          onClick={() => navigate('/history')}
          className="p-3 rounded-xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
              Campaign History
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">Export saved copies</p>
        </button>

        <button
          onClick={() => navigate('/architecture')}
          className="p-3 rounded-xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-left transition-all group cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
              Architecture & Docs
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">Pipeline audit specs</p>
        </button>
      </div>

      {/* 4. Recent Advertisements Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Advertisements</h2>
            <p className="text-xs text-slate-500">Latest saved campaign packages in your workspace</p>
          </div>
          {stats && stats.recentAds.length > 0 && (
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-xs text-slate-500">Loading recent ads...</span>
          </div>
        ) : !stats || stats.recentAds.length === 0 ? (
          /* Empty State required by Stage 4 */
          <div className="py-14 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-800">No advertisements generated yet.</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Start by entering your product details or picking an item to generate structured marketing copy.
              </p>
            </div>
            <button
              onClick={() => navigate('/generator')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Create Your First Advertisement</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recentAds.map((ad: Advertisement) => {
              const headline = ad.editedContent?.headline || ad.generatedContent.headline;
              const preview = ad.editedContent?.shortDescription || ad.generatedContent.shortDescription;
              return (
                <div
                  key={ad._id}
                  onClick={() => navigate(`/ads/${ad._id}`)}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {ad.productName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                        {ad.tone}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium">
                        {ad.platform}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-800 line-clamp-1">{headline}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{preview}</div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
