import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { applicantAPI } from '../utils/api';
import { storage, format, exportToCSV } from '../utils/helpers';

// ==================== ADMIN DASHBOARD ====================
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { loading, error, request } = useApi();

  // State
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    byStatus: { pending: 0, shortlisted: 0, rejected: 0 },
    byDomain: [],
  });

  // Filter states
  const [filters, setFilters] = useState({
    domain: 'All',
    status: 'All',
    search: '',
  });

  // Domains list
  const domains = [
    'Research Team',
    'Marketing Team',
    'Sponsorship Team',
    'Finance Team',
    'Design Team',
    'Media Team',
    'Content Team',
    'Event Managers and Editors',
  ];

  // Fetch applicants on component mount
  useEffect(() => {
    fetchApplicants();
    fetchStatistics();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [applicants, filters]);

  // Fetch all applicants
  const fetchApplicants = async () => {
    try {
      const response = await request(() =>
        applicantAPI.getAllApplicants({
          domain: filters.domain !== 'All' ? filters.domain : undefined,
          status: filters.status !== 'All' ? filters.status : undefined,
        })
      );
      setApplicants(response.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await request(() => applicantAPI.getStatistics());
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Apply filters to applicants
  const applyFilters = () => {
    let filtered = applicants;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          app.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredApplicants(filtered);
  };

  // Update applicant status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await request(() => applicantAPI.updateStatus(id, newStatus));

      // Update local state
      setApplicants((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );

      if (selectedApplicant?._id === id) {
        setSelectedApplicant((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }

      fetchStatistics();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Delete applicant
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await request(() => applicantAPI.deleteApplicant(id));
      setApplicants((prev) => prev.filter((app) => app._id !== id));
      setShowDetailModal(false);
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting applicant:', error);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const exportData = filteredApplicants.map((app) => ({
      Name: app.name,
      Email: app.email,
      Phone: app.phone,
      Department: app.department,
      Year: app.year,
      'First Preference': app.firstPreference,
      'Second Preference': app.secondPreference,
      Status: app.status,
      'Applied On': format.date(app.createdAt),
    }));

    exportToCSV(exportData, `tedxkare-applicants-${Date.now()}.csv`);
  };

  // Logout
  const handleLogout = () => {
    storage.clearAdmin();
    navigate('/admin');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-900/30 text-green-300 border-green-500/50';
      case 'Rejected':
        return 'bg-red-900/30 text-red-300 border-red-500/50';
      default:
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* ==================== TOP NAVIGATION ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container-flex h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ted-red">TEDxKARE Admin</h1>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </nav>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="container-flex pt-24">
        {/* ==================== HEADER ==================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Applicants Dashboard</h2>
          <p className="text-gray-400">
            View and manage all applications. Currently showing{' '}
            <span className="text-ted-red font-semibold">{filteredApplicants.length}</span> of{' '}
            <span className="text-ted-red font-semibold">{applicants.length}</span> applications.
          </p>
        </motion.div>

        {/* ==================== STATISTICS CARDS ==================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Applications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <p className="text-gray-400 text-sm mb-2">Total Applications</p>
            <p className="text-4xl font-bold text-ted-red">{stats.totalApplications}</p>
          </motion.div>

          {/* Pending */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card border-yellow-500/30"
          >
            <p className="text-yellow-400 text-sm mb-2">Pending Review</p>
            <p className="text-4xl font-bold text-yellow-400">{stats.byStatus.pending}</p>
          </motion.div>

          {/* Shortlisted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card border-green-500/30"
          >
            <p className="text-green-400 text-sm mb-2">Shortlisted</p>
            <p className="text-4xl font-bold text-green-400">{stats.byStatus.shortlisted}</p>
          </motion.div>

          {/* Rejected */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card border-red-500/30"
          >
            <p className="text-red-400 text-sm mb-2">Rejected</p>
            <p className="text-4xl font-bold text-red-400">{stats.byStatus.rejected}</p>
          </motion.div>
        </motion.div>

        {/* ==================== FILTERS & SEARCH ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field col-span-1 md:col-span-2"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />

            {/* Domain Filter */}
            <select
              className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              }}
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
            >
              <option value="All">All Domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              }}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-sm mt-4 w-full"
          >
            📥 Export to CSV
          </button>
        </motion.div>

        {/* ==================== APPLICANTS TABLE ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card overflow-x-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">Loading applicants...</p>
            </div>
          ) : filteredApplicants.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 font-semibold">Name</th>
                  <th className="text-left py-4 px-4 font-semibold">Email</th>
                  <th className="text-left py-4 px-4 font-semibold">Domain</th>
                  <th className="text-left py-4 px-4 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 font-semibold">Applied</th>
                  <th className="text-left py-4 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant, index) => (
                  <motion.tr
                    key={applicant._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium">{applicant.name}</td>
                    <td className="py-4 px-4 text-gray-400">{applicant.email}</td>
                    <td className="py-4 px-4">{applicant.firstPreference}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          applicant.status
                        )}`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-xs">
                      {format.date(applicant.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => {
                          setSelectedApplicant(applicant);
                          setShowDetailModal(true);
                        }}
                        className="text-ted-red hover:text-red-600 font-semibold text-sm"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">No applicants found matching your filters</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ==================== DETAIL MODAL ==================== */}
      {showDetailModal && selectedApplicant && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 border-b border-gray-800 bg-gray-900 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Application Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="text-ted-red font-bold mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Full Name</p>
                    <p className="font-semibold">{selectedApplicant.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-semibold break-all">{selectedApplicant.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-semibold">{selectedApplicant.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Department</p>
                    <p className="font-semibold">{selectedApplicant.department}</p>
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div>
                <h4 className="text-ted-red font-bold mb-4">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Year</p>
                    <p className="font-semibold">{selectedApplicant.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Availability</p>
                    <p className="font-semibold">{selectedApplicant.availability}</p>
                  </div>
                </div>
              </div>

              {/* Domain Preferences */}
              <div>
                <h4 className="text-ted-red font-bold mb-4">Domain Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">1st Choice</p>
                    <p className="font-semibold">{selectedApplicant.firstPreference}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">2nd Choice</p>
                    <p className="font-semibold">{selectedApplicant.secondPreference}</p>
                  </div>
                </div>
              </div>

              {/* Essays */}
              <div>
                <h4 className="text-ted-red font-bold mb-4">Motivation & Experience</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-2">Why TEDxKARE?</p>
                    <p className="bg-gray-800/50 p-3 rounded">{selectedApplicant.whyTedx}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-2">Why this domain?</p>
                    <p className="bg-gray-800/50 p-3 rounded">{selectedApplicant.whyDomain}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-2">Previous Experience</p>
                    <p className="bg-gray-800/50 p-3 rounded">{selectedApplicant.experience}</p>
                  </div>
                </div>
              </div>

              {/* Portfolio Links */}
              {(selectedApplicant.linkedin || selectedApplicant.portfolio) && (
                <div>
                  <h4 className="text-ted-red font-bold mb-4">Portfolio Links</h4>
                  <div className="space-y-2 text-sm">
                    {selectedApplicant.linkedin && (
                      <div>
                        <p className="text-gray-400 mb-1">LinkedIn</p>
                        <a
                          href={selectedApplicant.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ted-red hover:text-red-600 break-all"
                        >
                          {selectedApplicant.linkedin}
                        </a>
                      </div>
                    )}
                    {selectedApplicant.portfolio && (
                      <div>
                        <p className="text-gray-400 mb-1">Portfolio</p>
                        <a
                          href={selectedApplicant.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ted-red hover:text-red-600 break-all"
                        >
                          {selectedApplicant.portfolio}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-gray-800 pt-4">
                <p className="text-xs text-gray-500">
                  Applied on: {format.dateTime(selectedApplicant.createdAt)}
                </p>
              </div>

              {/* Status Management */}
              <div className="border-t border-gray-800 pt-6">
                <h4 className="text-ted-red font-bold mb-4">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {['Pending', 'Shortlisted', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedApplicant._id, status)}
                      disabled={selectedApplicant.status === status}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        selectedApplicant.status === status
                          ? 'bg-ted-red text-white'
                          : 'btn-outline'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(selectedApplicant._id)}
                className="w-full px-4 py-3 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors font-semibold"
              >
                Delete Application
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
