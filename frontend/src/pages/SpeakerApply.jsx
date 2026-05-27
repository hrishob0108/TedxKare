import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useApi } from '../hooks/useApi';
import { speakerAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ==================== SPEAKER APPLICATION PAGE ====================
const SpeakerApply = () => {
  const navigate = useNavigate();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, request, clearError } = useApi();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    title: '',
    abstract: '',
    durationMinutes: 10,
    sampleLink: '',
    bio: '',
    website: '', // Honeypot field
  };

  const onSubmit = async (values) => {
    try {
      // Validate email format before submission
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        form.setFieldError('email', 'Valid email is required (e.g., user@example.com)');
        return;
      }

      // Validate abstract length
      if (values.abstract.trim().length < 30) {
        form.setFieldError('abstract', 'Abstract must be at least 30 characters.');
        return;
      }

      await request(() => speakerAPI.submitSpeaker(values));
      setSubmitSuccess(true);

      // Redirect to thank you page after 1.5 seconds
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
      console.error('Error submitting speaker proposal:', error);
    }
  };

  const form = useForm(initialValues, onSubmit);

  // Stagger animation configurations
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
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 relative overflow-hidden">
      {/* Premium Neon Ambient Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Navbar />

      {/* ==================== HEADER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section text-center mb-8"
      >
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-ted-red hover:text-red-500 font-semibold mb-4 transition-colors gap-2"
        >
          <span>←</span> <span>Back to Home</span>
        </button>

        {/* Founding Pill Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-950/40 border border-red-500/30 text-ted-red shadow-lg shadow-red-950/20">
            🎤 Speaker Proposal Portal
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Apply to Speak at <span className="text-ted-red">TEDx</span><span className="text-white">KARE</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Share your groundbreaking ideas, narratives, and insights. We are looking for voices that inspire, challenge, and shape the future!
        </p>
      </motion.div>

      {/* ==================== FORM CONTAINER ==================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl mx-auto px-4 md:px-0"
      >
        {/* Success Alert Banner */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-green-950/30 border border-green-500/40 rounded-2xl text-green-300 text-center shadow-lg shadow-green-950/20"
          >
            <p className="font-semibold text-lg flex items-center justify-center gap-2">
              <span>✓</span> Proposal submitted successfully!
            </p>
            <p className="text-sm text-green-400/80 mt-1">Redirecting you to the thank you page...</p>
          </motion.div>
        )}

        {/* Error Alert Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-950/30 border border-red-500/40 rounded-2xl text-red-300 flex justify-between items-center shadow-lg shadow-red-950/20"
          >
            <div>
              <p className="font-semibold">Submission Issue</p>
              <p className="text-sm text-red-400/90 mt-0.5">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300 transition-colors font-bold text-lg px-2"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={form.handleSubmit} className="space-y-8">
          
          {/* ==================== SECTION 1: SPEAKER BIOGRAPHY ==================== */}
          <motion.div variants={itemVariants} className="card bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-gray-700/80 transition-all shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-ted-red border-b border-gray-800 pb-3 flex items-center gap-2">
              <span>👤</span> <span>Speaker Biography</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="form-group md:col-span-2">
                <label htmlFor="name" className="form-label text-sm text-gray-300 font-semibold mb-2 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  className="input-field w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none transition-colors"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading || submitSuccess}
                  required
                />
                {form.touched.name && form.errors.name && (
                  <p className="form-error text-xs text-red-500 mt-1.5">{form.errors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label htmlFor="email" className="form-label text-sm text-gray-300 font-semibold mb-2 block">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  className="input-field w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none transition-colors"
                  value={form.values.email}
                  onChange={(e) => {
                    form.handleChange(e);
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (e.target.value && !emailRegex.test(e.target.value)) {
                      form.setFieldError('email', 'Please provide a valid email structure.');
                    } else {
                      form.setFieldError('email', '');
                    }
                  }}
                  onBlur={form.handleBlur}
                  disabled={loading || submitSuccess}
                  required
                />
                {form.errors.email && (
                  <p className="form-error text-xs text-red-500 mt-1.5">{form.errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label text-sm text-gray-300 font-semibold mb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="10-digit phone number"
                  className="input-field w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none transition-colors"
                  value={form.values.phone}
                  onChange={(e) => {
                    form.handleChange(e);
                    const phoneRegex = /^[0-9]{10}$/;
                    const normalized = e.target.value.replace(/\D/g, '');
                    if (e.target.value && !phoneRegex.test(normalized)) {
                      form.setFieldError('phone', 'Phone number must be exactly 10 digits.');
                    } else {
                      form.setFieldError('phone', '');
                    }
                  }}
                  onBlur={form.handleBlur}
                  disabled={loading || submitSuccess}
                />
                {form.errors.phone && (
                  <p className="form-error text-xs text-red-500 mt-1.5">{form.errors.phone}</p>
                )}
              </div>

              {/* Short Bio */}
              <div className="form-group md:col-span-2">
                <label htmlFor="bio" className="form-label text-sm text-gray-300 font-semibold mb-2 block">
                  Speaker Bio (Tell us about yourself)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us a little bit about your background, achievements, and past speaking experience..."
                  rows="3"
                  className="input-field w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none transition-colors resize-none"
                  value={form.values.bio}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading || submitSuccess}
                />
              </div>
            </div>
          </motion.div>

          {/* ==================== SECTION 2: PROPOSAL DETAILS ==================== */}
          <motion.div variants={itemVariants} className="card bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-gray-700/80 transition-all shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-ted-red border-b border-gray-800 pb-3 flex items-center gap-2">
              <span>🎤</span> <span>Talk Proposal Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Talk Title */}
              <div className="form-group md:col-span-2">
                <label htmlFor="title" className="form-label text-sm text-gray-300 font-semibold mb-2 block">
                  Talk Title / Main Idea *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g., Breaking The Boundaries of Modern Computing"
                  className="input-field w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none transition-colors"
                  value={form.values.title}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading || submitSuccess}
                  required
                />
                {form.touched.title && form.errors.title && (
                  <p className="form-error text-xs text-red-500 mt-1.5">{form.errors.title}</p>
                )}
              </div>

              {/* Talk Abstract */}
              <div className="form-group md:col-span-2">
                <label htmlFor="abstract" className="form-label text-sm text-gray-300 font-semibold mb-2 block">
                  Short Abstract *
                </label>
                <textarea
                  id="abstract"
                  name="abstract"
                  placeholder="Provide a detailed summary of what your talk covers, the key takeaway, and why it is highly relevant for a TEDx stage..."
                  rows="5"
                  className="input-field w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none transition-colors resize-none"
                  value={form.values.abstract}
                  onChange={(e) => {
                    form.handleChange(e);
                    if (e.target.value && e.target.value.trim().length < 30) {
                      form.setFieldError('abstract', `Abstract must be at least 30 characters (${e.target.value.trim().length}/30).`);
                    } else {
                      form.setFieldError('abstract', '');
                    }
                  }}
                  onBlur={form.handleBlur}
                  disabled={loading || submitSuccess}
                  required
                />
                {form.errors.abstract ? (
                  <p className="form-error text-xs text-red-500 mt-1.5">{form.errors.abstract}</p>
                ) : (
                  <p className="text-[11px] text-gray-500 mt-1.5">Minimum 30 characters ({form.values.abstract.trim().length}/30)</p>
                )}
              </div>

              {/* Proposed Duration */}
              <div className="form-group">
                <label htmlFor="durationMinutes" className="form-label text-sm text-gray-300 font-semibold mb-2 block">
                  Proposed Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="durationMinutes"
                  name="durationMinutes"
                  min="1"
                  max="18"
                  placeholder="10"
                  className="input-field w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none transition-colors"
                  value={form.values.durationMinutes}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading || submitSuccess}
                  required
                />
                <p className="text-[11px] text-gray-500 mt-1.5">TEDx talks are strictly 18 minutes or less.</p>
              </div>

              {/* Sample Link */}
              <div className="form-group">
                <label htmlFor="sampleLink" className="form-label text-sm text-gray-300 font-semibold mb-2 block">
                  Sample Speaking Video / Slide Link
                </label>
                <input
                  type="url"
                  id="sampleLink"
                  name="sampleLink"
                  placeholder="https://youtube.com/... or https://drive.google.com/..."
                  className="input-field w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none transition-colors"
                  value={form.values.sampleLink}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  disabled={loading || submitSuccess}
                />
                {form.touched.sampleLink && form.errors.sampleLink && (
                  <p className="form-error text-xs text-red-500 mt-1.5">{form.errors.sampleLink}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Honeypot field (hidden from screen readers and bots) */}
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

          {/* ==================== SUBMIT BUTTONS ==================== */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading || submitSuccess}
              className="btn-primary flex-1 py-4 rounded-xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-950/40 transition-all"
            >
              {loading ? '⏳ Submitting Proposal...' : submitSuccess ? '✓ Received' : 'Submit Speaker Proposal'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-outline flex-1 py-4 rounded-xl text-lg font-bold hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
          </motion.div>

          <p className="text-center text-gray-500 text-xs mt-4">
            * indicates a required field. We respect your data privacy and will only use it for curation.
          </p>
        </form>
      </motion.div>

      <Footer />
    </div>
  );
};

export default SpeakerApply;
