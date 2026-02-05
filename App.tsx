
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import LeadForm from './pages/LeadForm';
import Result from './pages/Result';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { ResultData } from './types';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [assessmentResults, setAssessmentResults] = useState<ResultData | null>(null);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Router based on Hash
  const renderPage = () => {
    const hash = currentHash || '#/';

    if (hash === '#/') return <Home />;
    if (hash === '#/assessment') return <Assessment onComplete={(data) => {
      // Step to LeadForm is handled inside Assessment or as a step
    }} />;
    
    // Results are usually persistent or tied to a unique ID (hash)
    if (hash.startsWith('#/result')) {
      return <Result />;
    }

    if (hash === '#/admin-login') return <AdminLogin />;
    if (hash === '#/admin') return <AdminDashboard />;

    return <Home />;
  };

  return <>{renderPage()}</>;
};

export default App;
