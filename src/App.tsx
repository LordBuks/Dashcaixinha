import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Index from './pages/Index';
import Analytics from './pages/Analytics';
import LoginPage from './pages/Login';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics'>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <LoginPage />
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        {currentPage === 'dashboard' && <Index />}
        {currentPage === 'analytics' && <Analytics />}
      </div>
    </Router>
  );
}

export default App;

