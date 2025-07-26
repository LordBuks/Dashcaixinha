import React from 'react';
import { BarChart3, TrendingUp, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentPage: 'dashboard' | 'analytics';
  onPageChange: (page: 'dashboard' | 'analytics') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <button
              onClick={() => onPageChange('dashboard')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentPage === 'dashboard'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard Principal</span>
            </button>
            
            <button
              onClick={() => onPageChange('analytics')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentPage === 'analytics'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Análises Comparativas</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.displayName || user?.email}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

