import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { User, ShieldCheck, Mail, Calendar, Key, CheckCircle2 } from 'lucide-react';

interface ProfilePageProps {
  navigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { user } = useAuth();

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your account role, registered email address, and authentication status.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 font-bold text-2xl flex items-center justify-center border border-purple-200">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                user?.role === 'admin'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {user?.role || 'user'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Account Role</span>
            <div className="font-bold text-slate-900 capitalize flex items-center gap-1.5">
              {user?.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>System Administrator</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-slate-600" />
                  <span>Standard User</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Member Since</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Security Status</span>
            <div className="font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>JWT Bearer Protected</span>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
            <div>
              <strong className="block">You have administrative access</strong>
              <span className="text-purple-700">Manage all registered users, products, and campaign databases.</span>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors cursor-pointer"
            >
              Open Admin Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
