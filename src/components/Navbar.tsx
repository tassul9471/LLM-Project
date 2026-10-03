import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { 
  Sparkles, 
  LayoutDashboard, 
  Package, 
  Wand2, 
  History, 
  BookOpen, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/products', icon: Package },
        { name: 'Generator', path: '/generator', icon: Wand2, highlight: true },
        { name: 'History', path: '/history', icon: History },
        ...(user?.role === 'admin' ? [{ name: 'Admin Panel', path: '/admin', icon: ShieldCheck }] : []),
        { name: 'Architecture (Viva)', path: '/architecture', icon: BookOpen },
      ]
    : [
        { name: 'Home', path: '/', icon: Sparkles },
        { name: 'Architecture (Viva)', path: '/architecture', icon: BookOpen },
      ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNav(isAuthenticated ? '/dashboard' : '/')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              AI Ad Generator
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              BCA Project
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  link.highlight
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20 hover:bg-purple-700'
                    : isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${link.highlight ? 'text-white' : isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Desktop User Profile / Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <div 
                onClick={() => handleNav('/profile')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px] border border-purple-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 leading-none">{user.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[110px]">{user.email}</div>
                </div>
                {user.role === 'admin' && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  link.highlight
                    ? 'bg-purple-600 text-white'
                    : isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${link.highlight ? 'text-white' : isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="w-full py-2 px-3 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl text-center cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
