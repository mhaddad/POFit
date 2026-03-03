
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import LeadForm from './pages/LeadForm';
import ResultAdmin from './pages/ResultAdmin';
import ResultUser from './pages/ResultUser';
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
    if (hash === '#/assessment') return <Assessment />;

    if (hash.startsWith('#/result/admin/')) {
      return <ResultAdmin />;
    }

    if (hash.startsWith('#/result/user/')) {
      return <ResultUser />;
    }

    if (hash.startsWith('#/result/')) {
      // Legacy redirect to user view
      const resultId = hash.split('/').pop();
      if (resultId) {
        window.location.hash = `#/result/user/${resultId}`;
        return null; // Will re-render on hash change
      }
    }

    if (hash === '#/admin-login') return <AdminLogin />;
    if (hash === '#/admin') return <AdminDashboard />;

    return <Home />;
  };

  return <>{renderPage()}</>;
};

export default App;
