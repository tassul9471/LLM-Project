import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children, navigate }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (user?.role !== 'admin') {
        // Redirect unauthorized normal user to user dashboard
        navigate('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-white border border-red-200 shadow-sm text-center space-y-3">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Unauthorized Access</h3>
        <p className="text-xs text-slate-500">
          Administrator privileges are required to access this portal. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
