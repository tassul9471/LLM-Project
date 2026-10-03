import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api.js';
import { AdminDashboardStats } from '../../types/index.js';
import { 
  Users, 
  Package, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Clock,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await adminApi.getDashboard();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load administrator metrics.');
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Gathering system metrics from database...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Overview & Database Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time aggregate data across all registered users, product libraries, and AI campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/users')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate('/admin/ads')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            View All Ads
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3 Metric Cards - Compact Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Registered Users</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">{stats?.totalUsers || 0}</div>
            <div className="text-[11px] text-purple-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Database Verified</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Products Stored</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">{stats?.totalProducts || 0}</div>
            <div className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>Across User Accounts</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Advertisements Generated</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">{stats?.totalAds || 0}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Grounded AI Outputs</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Platform Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Campaigns by Target Platform</span>
          </h3>
          <div className="space-y-2.5">
            {stats && Object.entries(stats.platformBreakdown).length > 0 ? (
              Object.entries(stats.platformBreakdown).map(([platform, count]) => {
                const percent = Math.round((count / (stats.totalAds || 1)) * 100);
                return (
                  <div key={platform} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{platform}</span>
                      <span className="text-slate-500 font-mono">{count} ads ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No platform data available yet.</p>
            )}
          </div>
        </div>

        {/* Tone Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Tone Preference Distribution</span>
          </h3>
          <div className="space-y-2.5">
            {stats && Object.entries(stats.toneBreakdown).length > 0 ? (
              Object.entries(stats.toneBreakdown).map(([tone, count]) => {
                const percent = Math.round((count / (stats.totalAds || 1)) * 100);
                return (
                  <div key={tone} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{tone}</span>
                      <span className="text-slate-500 font-mono">{count} ads ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No tone distribution data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Recent User Registrations</h3>
            <p className="text-[11px] text-slate-500">Latest accounts registered on the platform</p>
          </div>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2.5">User</th>
                <th className="py-2 px-2.5">Email</th>
                <th className="py-2 px-2.5">Role</th>
                <th className="py-2 px-2.5">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats?.recentUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-2.5 font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[9px]">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs">{u.name}</span>
                  </td>
                  <td className="py-2 px-2.5 text-slate-600 font-mono text-[11px]">{u.email}</td>
                  <td className="py-2 px-2.5">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 text-slate-500 text-[11px] font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Advertisements Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Recent Generated Advertisements</h3>
            <p className="text-[11px] text-slate-500">Latest campaigns produced across the application</p>
          </div>
          <button
            onClick={() => navigate('/admin/ads')}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2 px-2.5">Product Name</th>
                <th className="py-2 px-2.5">Owner</th>
                <th className="py-2 px-2.5">Platform</th>
                <th className="py-2 px-2.5">Tone</th>
                <th className="py-2 px-2.5">Headline Preview</th>
                <th className="py-2 px-2.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats?.recentAds.map((a) => (
                <tr key={a._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-2.5 font-semibold text-slate-900 text-xs">{a.productName}</td>
                  <td className="py-2 px-2.5 text-slate-600 text-xs">{a.ownerName}</td>
                  <td className="py-2 px-2.5">
                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium">
                      {a.platform}
                    </span>
                  </td>
                  <td className="py-2 px-2.5">
                    <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-medium">
                      {a.tone}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 text-slate-600 max-w-xs truncate text-xs">{a.headline}</td>
                  <td className="py-2 px-2.5 text-slate-400 whitespace-nowrap text-[11px] font-mono">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
