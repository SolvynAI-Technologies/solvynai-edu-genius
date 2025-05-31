
import React from 'react';
import { AppSidebarWrapper } from './Sidebar';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = true }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-solvyn-500"></div>
      </div>
    );
  }

  if (requireAuth && !currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAuth) {
    return <AppSidebarWrapper>{children}</AppSidebarWrapper>;
  }

  return <>{children}</>;
};

export default Layout;
