import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import Index from './pages/Index';
import Analytics from './pages/Analytics';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics'>('dashboard');

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

