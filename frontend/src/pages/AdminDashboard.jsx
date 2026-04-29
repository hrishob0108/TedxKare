import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { applicantAPI, settingsAPI } from '../utils/api';
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
  const [selectedShortlistDomain, setSelectedShortlistDomain] = useState('');
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
    'Selection Committee (Curation Team)',
    'Executive Producer',
    'Event Manager',
    'Sponsorship & Budget Manager',
    'Designer',
    'Communications & Marketing Director',
    'Video Production',
    'Research Team',
  ];

  const [registrationOpen, setRegistrationOpen] = useState(true);

  // Fetch applicants and settings on component mount
  useEffect(() => {
    fetchApplicants();
    fetchStatistics();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await request(() => settingsAPI.getSettings());
      setRegistrationOpen(response.data.registrationOpen);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleToggleRegistration = async () => {
    try {
      const newState = !registrationOpen;
      await request(() => settingsAPI.updateSettings({ registrationOpen: newState }));
      setRegistrationOpen(newState);
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  };

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
  const handleStatusChange = async (id, newStatus, email) => {
    try {
      if (newStatus === 'Shortlisted' && !selectedShortlistDomain) {
        alert("Please select a domain to shortlist the applicant for.");
        return;
      }
      
      await request(() => applicantAPI.updateStatus(id, newStatus, email, newStatus === 'Shortlisted' ? selectedShortlistDomain : null));

      // Update local state
      setApplicants((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus, shortlistedDomain: newStatus === 'Shortlisted' ? selectedShortlistDomain : '' } : app))
      );

      if (selectedApplicant?._id === id) {
        setSelectedApplicant((prev) => ({
          ...prev,
          status: newStatus,
          shortlistedDomain: newStatus === 'Shortlisted' ? selectedShortlistDomain : ''
        }));
      }

      // Reset selection
      if (newStatus === 'Shortlisted') {
        setSelectedShortlistDomain('');
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
      'Registration Number': app.registrationNumber,
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
          <h1 className="text-2xl font-bold">
            <span className="text-ted-red">TED</span>
            <span className="text-white">xKARE Admin</span>
          </h1>
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
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Applicants Dashboard</h2>
            <p className="text-gray-400">
              View and manage all applications. Currently showing{' '}
              <span className="text-ted-red font-semibold">{filteredApplicants.length}</span> of{' '}
              <span className="text-ted-red font-semibold">{applicants.length}</span> applications.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <div>
              <p className="text-sm font-semibold mb-1">Registration Status</p>
              <p className={`text-xs ${registrationOpen ? 'text-green-400' : 'text-red-400'}`}>
                {registrationOpen ? '🟢 Accepting Applications' : '🔴 Applications Closed'}
              </p>
            </div>
            <button
              onClick={handleToggleRegistration}
              disabled={loading}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                registrationOpen ? 'bg-ted-red' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  registrationOpen ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
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
                    <p className="text-gray-400">Registration Number</p>
                    <p className="font-semibold">{selectedApplicant.registrationNumber}</p>
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

              {/* Links */}
              {(selectedApplicant.linkedin || selectedApplicant.resume) && (
                <div>
                  <h4 className="text-ted-red font-bold mb-4">Important Links</h4>
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
                    {selectedApplicant.resume && (
                      <div>
                        <p className="text-gray-400 mb-1">Resume</p>
                        <a
                          href={selectedApplicant.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ted-red hover:text-red-600 break-all"
                        >
                          {selectedApplicant.resume}
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
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={() => handleStatusChange(selectedApplicant._id, 'Pending', selectedApplicant.email)}
                      disabled={selectedApplicant.status === 'Pending'}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedApplicant.status === 'Pending'
                        ? 'bg-ted-red text-white'
                        : 'btn-outline'
                        }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApplicant._id, 'Rejected', selectedApplicant.email)}
                      disabled={selectedApplicant.status === 'Rejected'}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedApplicant.status === 'Rejected'
                        ? 'bg-ted-red text-white'
                        : 'btn-outline'
                        }`}
                    >
                      Rejected
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2 md:items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex-1">
                      <label className="text-sm text-gray-400 mb-1 block">Shortlist for Role:</label>
                      <select
                        className="input-field py-2 text-sm appearance-none bg-gray-900 bg-right bg-no-repeat pr-10 w-full"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        }}
                        value={selectedShortlistDomain || (selectedApplicant.status === 'Shortlisted' ? selectedApplicant.shortlistedDomain : '')}
                        onChange={(e) => setSelectedShortlistDomain(e.target.value)}
                        disabled={selectedApplicant.status === 'Shortlisted'}
                      >
                        <option value="">-- Select Role to Shortlist --</option>
                        <optgroup label="Applicant Preferences">
                          <option value={selectedApplicant.firstPreference}>1st Choice: {selectedApplicant.firstPreference}</option>
                          <option value={selectedApplicant.secondPreference}>2nd Choice: {selectedApplicant.secondPreference}</option>
                        </optgroup>
                        <optgroup label="All Roles">
                          {domains.filter(d => d !== selectedApplicant.firstPreference && d !== selectedApplicant.secondPreference).map(domain => (
                            <option key={domain} value={domain}>{domain}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <button
                      onClick={() => handleStatusChange(selectedApplicant._id, 'Shortlisted', selectedApplicant.email)}
                      disabled={selectedApplicant.status === 'Shortlisted' || !selectedShortlistDomain}
                      className={`px-4 py-2 mt-auto h-[42px] rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${selectedApplicant.status === 'Shortlisted'
                        ? 'bg-green-600 text-white cursor-not-allowed opacity-80'
                        : !selectedShortlistDomain ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                      {selectedApplicant.status === 'Shortlisted' ? '✓ Shortlisted' : 'Shortlist Applicant'}
                    </button>
                  </div>
                  {selectedApplicant.status === 'Shortlisted' && selectedApplicant.shortlistedDomain && (
                    <p className="text-sm text-green-400 mt-1">
                      Currently shortlisted for: <span className="font-bold">{selectedApplicant.shortlistedDomain}</span>
                    </p>
                  )}
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
