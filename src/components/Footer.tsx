import React from 'react';
import { Sparkles, Database, Cpu, ShieldCheck, Terminal, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900">AI Ad Generator</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              Full-stack AI-Powered Product Advertisement Generator built for BCA final-year project.
              Translates product specifications into ready-to-publish multi-channel ad copy using Generative AI.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                <Cpu className="w-3.5 h-3.5 text-purple-600" /> Node + Express
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                <Database className="w-3.5 h-3.5 text-indigo-600" /> MongoDB Architecture
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Google Gemini AI
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Role-Based Access Control
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-purple-600 transition-colors cursor-pointer text-left"
                >
                  User Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/generator')}
                  className="hover:text-purple-600 transition-colors cursor-pointer text-left font-medium text-purple-600"
                >
                  AI Ad Generator Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/products')}
                  className="hover:text-purple-600 transition-colors cursor-pointer text-left"
                >
                  Product Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/history')}
                  className="hover:text-purple-600 transition-colors cursor-pointer text-left"
                >
                  Advertisement History
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-purple-600 transition-colors cursor-pointer text-left font-medium text-slate-700"
                >
                  Admin Panel (Protected)
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              BCA Examination Viva
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/architecture')}
                  className="hover:text-purple-600 transition-colors cursor-pointer text-left font-semibold text-purple-600"
                >
                  Full 13-Stage Architecture
                </button>
              </li>
              <li>
                <span className="text-slate-400">Strict Fact Grounding</span>
              </li>
              <li>
                <span className="text-slate-400">JWT Token Middleware</span>
              </li>
              <li>
                <span className="text-slate-400">Role-Based Authorization</span>
              </li>
              <li>
                <span className="text-slate-400">Text File (.txt) Export</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 AI Ad Generator — Bachelor of Computer Applications (BCA) Project</p>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Engineered with React, Node, Express, MongoDB & Gemini API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
