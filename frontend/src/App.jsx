import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ApplyForm from './components/ApplyForm';

const NavLinks = () => {
  const location = useLocation();
  return (
    <div className="flex gap-6">
      <Link to="/" className={`font-medium transition-colors hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}>Dashboard</Link>
      <Link to="/apply" className={`font-medium transition-colors hover:text-blue-600 ${location.pathname === '/apply' ? 'text-blue-600' : 'text-gray-600'}`}>Apply</Link>
    </div>
  );
};

function App() {
  return (
    <Router>
      <nav className="bg-white shadow-sm py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 decoration-none">Vitto Loans</Link>
          <NavLinks />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/apply" element={<ApplyForm />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
