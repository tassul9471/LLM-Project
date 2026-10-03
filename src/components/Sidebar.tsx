import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { 
  Sparkles, 
  LayoutDashboard, 
  Package, 
  Wand2, 
  History, 
  User as UserIcon, 
  BookOpen, 
  LogOut, 
  ShieldCheck, 
  Users, 
  FileText, 
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: any;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPath, 
  navigate, 
  mobileOpen, 
  setMobileOpen 
}) => {
  const { user, logout } = useAuth();
  const isAdminPath = currentPath.startsWith('/admin');
  const isAdminUser = user?.role === 'admin';

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const userNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Generate Ad', path: '/generator', icon: Wand2, highlight: true },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Viva Architecture', path: '/architecture', icon: BookOpen },
  ];

  const adminNavItems: NavItem[] = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'All Products', path: '/admin/products', icon: Package },
    { name: 'All Advertisements', path: '/admin/ads', icon: FileText },
    { name: 'Viva Architecture', path: '/architecture', icon: BookOpen },
  ];

  const currentNavItems = isAdminPath ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 
        flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Logo & Mode */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNav(isAdminPath ? '/admin' : '/dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                  AI Ad Generator
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {isAdminPath ? 'Admin Portal' : 'Marketing Suite'}
                </span>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Switcher Card */}
          {isAdminUser && (
            <div className="pt-1">
              {isAdminPath ? (
                <button
                  onClick={() => handleNav('/dashboard')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                    <span>Return to User View</span>
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">User</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/70 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Access Admin Panel</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Middle: Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isAdminPath ? 'Administration' : 'Main Menu'}
          </div>

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer
                  ${
                    item.highlight
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/25 hover:bg-purple-700'
                      : isActive
                      ? 'bg-purple-50 text-purple-700 font-bold border border-purple-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-white' : isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                <span className="flex-1">{item.name}</span>
                {isActive && !item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom: User Card & Logout */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {user && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
              <div 
                onClick={() => handleNav('/profile')}
                className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>
              </div>

              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {user.role || 'user'}
              </span>
            </div>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
