import React, { useState, useEffect } from 'react';
import api from '../api';
import StatusBadge from './StatusBadge';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getLangBadgeStyle = (lang) => {
  switch (lang.toLowerCase()) {
    case 'hindi': return 'bg-blue-100 text-blue-800';
    case 'tamil': return 'bg-orange-100 text-orange-800';
    case 'telugu': return 'bg-purple-100 text-purple-800';
    case 'marathi': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const Dashboard = () => {
  const [summary, setSummary] = useState({ total: 0, totalAmount: 0, pending: 0, approved: 0, rejected: 0 });
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);
  
  const fetchSummary = async () => {
    try {
      const res = await api.get('/api/summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary');
    }
  };

  const fetchApplications = async () => {
    try {
      const statusQuery = filterStatus !== 'All' ? `?status=${filterStatus.toLowerCase()}` : '';
      const res = await api.get(`/api/applications${statusQuery}`);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications');
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    setLoadingAction(id);
    try {
      const res = await api.patch(`/api/applications/${id}/status`, { status: newStatus });
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: res.data.status } : app));
      fetchSummary();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setLoadingAction(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const query = searchQuery.toLowerCase();
    return app.name.toLowerCase().includes(query) || app.mobile.includes(query);
  });

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">Total Applications</div>
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">Total Amount</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">Approved</div>
          <div className="text-2xl font-bold text-green-600">{summary.approved}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-2">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{summary.rejected}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select 
          className="w-auto min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input 
          type="text" 
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Search name or mobile..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-50 font-semibold text-gray-500 whitespace-nowrap p-4 border-b border-gray-200">Applicant Name</th>
              <th className="bg-gray-50 font-semibold text-gray-500 whitespace-nowrap p-4 border-b border-gray-200">Mobile</th>
              <th className="bg-gray-50 font-semibold text-gray-500 whitespace-nowrap p-4 border-b border-gray-200">Amount</th>
              <th className="bg-gray-50 font-semibold text-gray-500 whitespace-nowrap p-4 border-b border-gray-200">Purpose</th>
              <th className="bg-gray-50 font-semibold text-gray-500 whitespace-nowrap p-4 border-b border-gray-200">Language</th>
              <th className="bg-gray-50 font-semibold text-gray-500 whitespace-nowrap p-4 border-b border-gray-200">Status</th>
              <th className="bg-gray-50 font-semibold text-gray-500 whitespace-nowrap p-4 border-b border-gray-200">Date</th>
              <th className="bg-gray-50 font-semibold text-gray-500 whitespace-nowrap p-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-500">No applications found.</td>
              </tr>
            ) : filteredApplications.map(app => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 align-middle">{app.name}</td>
                <td className="p-4 align-middle">{app.mobile}</td>
                <td className="p-4 align-middle">{formatCurrency(app.amount)}</td>
                <td className="p-4 align-middle">{app.purpose}</td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getLangBadgeStyle(app.language)}`}>
                    {app.language}
                  </span>
                </td>
                <td className="p-4 align-middle"><StatusBadge status={app.status} /></td>
                <td className="p-4 align-middle">{formatDate(app.created_at)}</td>
                <td className="p-4 align-middle">
                  <div className="flex gap-2">
                    <button 
                      className="px-2 py-1 text-xs rounded font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-green-200"
                      disabled={app.status !== 'pending' || loadingAction === app.id}
                      onClick={() => handleStatusUpdate(app.id, 'approved')}
                    >
                      {loadingAction === app.id && app.status === 'pending' ? '...' : 'Approve'}
                    </button>
                    <button 
                      className="px-2 py-1 text-xs rounded font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-red-200"
                      disabled={app.status !== 'pending' || loadingAction === app.id}
                      onClick={() => handleStatusUpdate(app.id, 'rejected')}
                    >
                      {loadingAction === app.id && app.status === 'pending' ? '...' : 'Reject'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
