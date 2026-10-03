import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { Sidebar } from './components/Sidebar.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { AdminRoute } from './components/AdminRoute.js';

// User Pages
import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProductsPage } from './pages/ProductsPage.js';
import { GeneratorPage } from './pages/GeneratorPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { AdDetailPage } from './pages/AdDetailPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { ProjectDocsPage } from './pages/ProjectDocsPage.js';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.js';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.js';
import { AdminAdsPage } from './pages/admin/AdminAdsPage.js';

import { Menu, Sparkles, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileSidebarOpen(false);
  };

  const isPublicPage = currentPath === '/' || currentPath === '/login' || currentPath === '/register';
  const showSidebar = isAuthenticated && !isPublicPage;

  const renderContent = () => {
    // Dynamic advertisement detail route /ads/:id
    if (currentPath.startsWith('/ads/')) {
      const id = currentPath.replace('/ads/', '').split('/')[0];
      return (
        <ProtectedRoute navigate={navigate}>
          <AdDetailPage id={id} navigate={navigate} />
        </ProtectedRoute>
      );
    }

    switch (currentPath) {
      case '/':
        return <LandingPage navigate={navigate} />;

      case '/login':
        return <LoginPage navigate={navigate} />;

      case '/register':
        return <RegisterPage navigate={navigate} />;

      case '/dashboard':
        return (
          <ProtectedRoute navigate={navigate}>
            <DashboardPage navigate={navigate} />
          </ProtectedRoute>
        );

      case '/products':
        return (
          <ProtectedRoute navigate={navigate}>
            <ProductsPage navigate={navigate} />
          </ProtectedRoute>
        );

      case '/generator':
        return (
          <ProtectedRoute navigate={navigate}>
            <GeneratorPage navigate={navigate} />
          </ProtectedRoute>
        );

      case '/history':
        return (
          <ProtectedRoute navigate={navigate}>
            <HistoryPage navigate={navigate} />
          </ProtectedRoute>
        );

      case '/profile':
        return (
          <ProtectedRoute navigate={navigate}>
            <ProfilePage navigate={navigate} />
          </ProtectedRoute>
        );

      // Admin Routes protected by both requireAuth and requireAdmin
      case '/admin':
        return (
          <AdminRoute navigate={navigate}>
            <AdminDashboardPage navigate={navigate} />
          </AdminRoute>
        );

      case '/admin/users':
        return (
          <AdminRoute navigate={navigate}>
            <AdminUsersPage navigate={navigate} />
          </AdminRoute>
        );

      case '/admin/products':
        return (
          <AdminRoute navigate={navigate}>
            <AdminProductsPage navigate={navigate} />
          </AdminRoute>
        );

      case '/admin/ads':
        return (
          <AdminRoute navigate={navigate}>
            <AdminAdsPage navigate={navigate} />
          </AdminRoute>
        );

      case '/architecture':
        return <ProjectDocsPage navigate={navigate} />;

      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  // If user is authenticated and on an app dashboard or admin page, render the Vertical Menu layout
  if (showSidebar) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900">
        {/* Vertical Sidebar */}
        <Sidebar
          currentPath={currentPath}
          navigate={navigate}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Area Pushed Right on Desktop */}
        <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
          {/* Top Bar on Mobile & Desktop */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Hamburger Toggle */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
                aria-label="Open navigation sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                  {currentPath.startsWith('/admin') ? 'Administrator Portal' : 'Workspace'} /
                </span>
                <span className="text-xs font-bold text-slate-800 capitalize">
                  {currentPath.startsWith('/admin')
                    ? currentPath.replace('/admin', '').replace('/', '') || 'Overview'
                    : currentPath.replace('/', '') || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user?.role === 'admin' && (
                <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Session</span>
                </div>
              )}

              <div 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-700 hidden md:inline">
                  {user?.name}
                </span>
              </div>
            </div>
          </header>

          {/* Main Route View */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    );
  }

  // Public Landing / Auth / Guest Pages with Top Navbar & Footer in Light Theme
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
