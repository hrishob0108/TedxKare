import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useApi } from '../hooks/useApi';
import { applicantAPI, settingsAPI } from '../utils/api';

// ==================== DOMAIN OPTIONS ====================
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

const departments = [
  'Computer Science',
  'Information Technology',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Electronics',
  'Other',
];

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];



// ==================== APPLY PAGE ====================
const Apply = () => {
  const navigate = useNavigate();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, request, clearError } = useApi();

  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Scroll to top and check status on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    const checkStatus = async () => {
      try {
        const response = await settingsAPI.getSettings();
        setRegistrationOpen(response.data.data.registrationOpen);
      } catch (err) {
        console.error('Failed to fetch registration status', err);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    registrationNumber: '',
    department: '',
    year: '',
    linkedin: '',
    resume: '',
    firstPreference: '',
    secondPreference: '',
    whyTedx: '',
    whyDomain: '',
    experience: '',
    website: '', // Honeypot field
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };

  const onSubmit = async (values) => {
    try {
      // Validate email format before submission
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        form.setFieldError('email', 'Valid email is required (e.g., user@example.com)');
        return;
      }

      await request(() => applicantAPI.submitApplication(values));
      setSubmitSuccess(true);

      // Redirect to thank you page after 2 seconds
      setTimeout(() => {
        navigate('/thank-you');
      }, 1500);
    } catch (error) {
      // Handle server-side validation errors
      if (error.response?.status === 400 && error.response?.data?.details) {
        const fieldErrors = {};
        error.response.data.details.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        form.setErrors(fieldErrors);
      }
      console.error('Error submitting application:', error);
    }
  };

  const form = useForm(initialValues, onSubmit);

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ted-red"></div>
      </div>
    );
  }

  if (!registrationOpen) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl shadow-red-900/20"
        >
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏳</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Registration Closed</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your interest in joining <span className="text-ted-red font-semibold">TEDxKARE</span>. 
            The application period has currently ended. Stay tuned to our social media for future opportunities!
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary py-3 font-semibold"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Prevent selecting same domain twice
  const isSecondPreferenceDisabled = form.values.firstPreference === form.values.secondPreference;

  // Form animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section text-center mb-8"
      >
        <button
          onClick={() => navigate('/')}
          className="inline-block text-ted-red hover:text-red-600 font-semibold mb-4"
        >
          ← Back to Home
        </button>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join TEDxKARE</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Tell us about yourself and why you want to be part of our team. We&apos;re excited to learn about
          your passion and skills!
        </p>
      </motion.div>

      {/* ==================== FORM CONTAINER ==================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl mx-auto px-4 md:px-0"
      >
        {/* Success Message */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-green-900/30 border border-green-500/50 rounded-lg text-green-300 text-center"
          >
            <p className="font-semibold">✓ Application submitted successfully!</p>
            <p className="text-sm mt-2">Redirecting to confirmation page...</p>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-200 font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Application Form */}
        <form onSubmit={form.handleSubmit} className="space-y-8">
          {/* ==================== SECTION 1: PERSONAL INFO ==================== */}
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-2xl font-bold mb-6 text-ted-red">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="form-group md:col-span-2">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  className="input-field"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading}
                  required
                />
                {form.touched.name && form.errors.name && (
                  <p className="form-error">{form.errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@klu.ac.in"
                  className="input-field"
                  value={form.values.email}
                  onChange={(e) => {
                    form.handleChange(e);
                    // Real-time email validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (e.target.value && !emailRegex.test(e.target.value)) {
                      form.setFieldError('email', 'Valid email is required (e.g., user@klu.ac.on.com)');
                    } else {
                      form.setFieldError('email', '');
                    }
                  }}
                  onBlur={form.handleBlur}
                  disabled={loading}
                  required
                />
                {form.errors.email && (
                  <p className="form-error">{form.errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="10-digit number"
                  className="input-field"
                  value={form.values.phone}
                  onChange={(e) => {
                    form.handleChange(e);
                    // Real-time phone validation
                    const phoneRegex = /^[0-9]{10}$/;
                    if (e.target.value && !phoneRegex.test(e.target.value.replace(/\D/g, ''))) {
                      form.setFieldError('phone', 'Phone number must be 10 digits');
                    } else {
                      form.setFieldError('phone', '');
                    }
                  }}
                  onBlur={form.handleBlur}
                  disabled={loading}
                  required
                />
                {form.errors.phone && (
                  <p className="form-error">{form.errors.phone}</p>
                )}
              </div>

              {/* Registration Number */}
              <div className="form-group">
                <label htmlFor="registrationNumber" className="form-label">
                  Registration Number *
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  placeholder="e.g., 992400....."
                  className="input-field"
                  value={form.values.registrationNumber}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading}
                  required
                />
                {form.touched.registrationNumber && form.errors.registrationNumber && (
                  <p className="form-error">{form.errors.registrationNumber}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ==================== SECTION 2: ACADEMIC INFO ==================== */}
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-2xl font-bold mb-6 text-ted-red">Academic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  }}
                  value={form.values.department}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year of Study */}
              <div className="form-group">
                <label htmlFor="year" className="form-label">
                  Year of Study *
                </label>
                <select
                  id="year"
                  name="year"
                  className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  }}
                  value={form.values.year}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* ==================== SECTION 3: LINKS ====================*/}
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-2xl font-bold mb-6 text-ted-red">Important Links</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LinkedIn */}
              <div className="form-group">
                <label htmlFor="linkedin" className="form-label">
                  LinkedIn URL *
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="input-field"
                  value={form.values.linkedin}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading}
                  required
                />
                {form.touched.linkedin && form.errors.linkedin && (
                  <p className="form-error">{form.errors.linkedin}</p>
                )}
              </div>

              {/* Resume */}
              <div className="form-group">
                <label htmlFor="resume" className="form-label">
                  Resume Link (Drive/Docs) (Optional)
                </label>
                <input
                  type="url"
                  id="resume"
                  name="resume"
                  placeholder="https://your-resume-link.com"
                  className="input-field"
                  value={form.values.resume}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading}
                />
                {form.touched.resume && form.errors.resume && (
                  <p className="form-error">{form.errors.resume}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ==================== SECTION 4: DOMAIN PREFERENCES ==================== */}
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-2xl font-bold mb-6 text-ted-red">Domain Preferences</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Preference */}
              <div className="form-group">
                <label htmlFor="firstPreference" className="form-label">
                  1st Choice Domain *
                </label>
                <select
                  id="firstPreference"
                  name="firstPreference"
                  className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  }}
                  value={form.values.firstPreference}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading}
                  required
                >
                  <option value="">Select your first choice</option>
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              {/* Second Preference */}
              <div className="form-group">
                <label htmlFor="secondPreference" className="form-label">
                  2nd Choice Domain *
                </label>
                <select
                  id="secondPreference"
                  name="secondPreference"
                  className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  }}
                  value={form.values.secondPreference}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading || isSecondPreferenceDisabled}
                  required
                >
                  <option value="">Select your second choice</option>
                  {domains.map((domain) => (
                    <option
                      key={domain}
                      value={domain}
                      disabled={domain === form.values.firstPreference}
                    >
                      {domain}
                    </option>
                  ))}
                </select>
                {isSecondPreferenceDisabled && (
                  <p className="form-hint">Select a different domain than your first choice</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ==================== SECTION 5: MOTIVATION ==================== */}
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-2xl font-bold mb-6 text-ted-red">Tell Us More</h3>

            {/* Why TEDx */}
            <div className="form-group mb-6">
              <label htmlFor="whyTedx" className="form-label">
                Why do you want to join TEDxKARE? *
              </label>
              <textarea
                id="whyTedx"
                name="whyTedx"
                placeholder="Share your motivation and passion for TEDx..."
                rows="4"
                className="input-field resize-none"
                value={form.values.whyTedx}
                onChange={(e) => {
                  form.handleChange(e);
                  // Real-time validation for minimum characters
                  if (e.target.value && e.target.value.trim().length < 20) {
                    form.setFieldError('whyTedx', `Minimum 20 characters required (${e.target.value.trim().length}/20)`);
                  } else {
                    form.setFieldError('whyTedx', '');
                  }
                }}
                onBlur={form.handleBlur}
                disabled={loading}
                required
              />
              {form.errors.whyTedx ? (
                <p className="form-error">{form.errors.whyTedx}</p>
              ) : (
                <p className="form-hint">Minimum 20 characters ({form.values.whyTedx.trim().length}/20)</p>
              )}
            </div>

            {/* Why This Domain */}
            <div className="form-group mb-6">
              <label htmlFor="whyDomain" className="form-label">
                Why are you interested in your chosen domain? *
              </label>
              <textarea
                id="whyDomain"
                name="whyDomain"
                placeholder="Tell us why this role excites you..."
                rows="4"
                className="input-field resize-none"
                value={form.values.whyDomain}
                onChange={(e) => {
                  form.handleChange(e);
                  // Real-time validation for minimum characters
                  if (e.target.value && e.target.value.trim().length < 20) {
                    form.setFieldError('whyDomain', `Minimum 20 characters required (${e.target.value.trim().length}/20)`);
                  } else {
                    form.setFieldError('whyDomain', '');
                  }
                }}
                onBlur={form.handleBlur}
                disabled={loading}
                required
              />
              {form.errors.whyDomain ? (
                <p className="form-error">{form.errors.whyDomain}</p>
              ) : (
                <p className="form-hint">Minimum 20 characters ({form.values.whyDomain.trim().length}/20)</p>
              )}
            </div>

            {/* Previous Experience */}
            <div className="form-group">
              <label htmlFor="experience" className="form-label">
                What relevant experience do you have? *
              </label>
              <textarea
                id="experience"
                name="experience"
                placeholder="Share any previous experience or projects..."
                rows="4"
                className="input-field resize-none"
                value={form.values.experience}
                onChange={(e) => {
                  form.handleChange(e);
                  // Real-time validation for minimum characters
                  if (e.target.value && e.target.value.trim().length < 20) {
                    form.setFieldError('experience', `Minimum 20 characters required (${e.target.value.trim().length}/20)`);
                  } else {
                    form.setFieldError('experience', '');
                  }
                }}
                onBlur={form.handleBlur}
                disabled={loading}
                required
              />
              {form.errors.experience ? (
                <p className="form-error">{form.errors.experience}</p>
              ) : (
                <p className="form-hint">Minimum 20 characters ({form.values.experience.trim().length}/20)</p>
              )}
            </div>
          </motion.div>
          {/* Honeypot field (hidden from users) */}
          <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
            <input
              type="text"
              name="website"
              value={form.values.website}
              onChange={form.handleChange}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>



          {/* ==================== SUBMIT BUTTON ==================== */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading || submitSuccess}
              className="btn-primary flex-1 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Submitting...' : submitSuccess ? '✓ Submitted' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-outline flex-1 py-4 text-lg font-semibold"
            >
              Cancel
            </button>
          </motion.div>

          {/* Form Counter */}
          <p className="text-center text-gray-400 text-sm">
            * indicates required fields
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Apply;
