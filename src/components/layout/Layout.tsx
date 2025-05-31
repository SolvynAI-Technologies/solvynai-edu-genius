
import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { currentUser, isLoading } = useAuth();
  
  const isAuthPage = location.pathname.startsWith('/auth');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-solvyn-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to auth if not logged in and not on auth page
  if (!currentUser && !isAuthPage) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Redirect to dashboard if logged in and on auth page
  if (currentUser && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Show auth pages without sidebar
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
