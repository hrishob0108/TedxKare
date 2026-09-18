import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useApi } from '../hooks/useApi';
import { attendeeAPI, settingsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const occupations = [
  'Student',
  'Faculty',
  'Founder / Entrepreneur',
  'Business Professional',
  'Other'
];

const sources = [
  'Instagram',
  'LinkedIn',
  'Friends/Word of Mouth',
  'College Notice Board',
  'Faculty/Professors',
  'Other'
];

const AttendeeApply = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, request, clearError } = useApi();

  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const checkStatus = async () => {
    setConnectionError(false);
    setIsCheckingStatus(true);
    let attempts = 50;
    while (attempts > 0) {
      try {
        const response = await settingsAPI.getSettings({ timeout: 4000 });
        setRegistrationOpen(response.data.data.attendeeRegistrationOpen ?? response.data.data.registrationOpen ?? true);
        setIsCheckingStatus(false);
        return;
      } catch (err) {
        attempts--;
        console.error(`Failed to fetch registration status. Remaining attempts: ${attempts}`, err);
        if (attempts > 0) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }
    setConnectionError(true);
    setIsCheckingStatus(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    checkStatus();
  }, []);

  const initialValues = {
    name: '',
    age: '',
    email: '',
    phone: '',
    linkedin: '',
    address: '',
    occupation: '',
    organization: '',
    designation: '',
    year: '',
    registrationNumber: '',
    source: '',
    transactionId: '',
    paymentScreenshot: '',
    website: '', // Honeypot
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };

  const onSubmit = async (values) => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        form.setFieldError('email', 'Valid email is required');
        return;
      }
      if (!values.transactionId) {
        form.setFieldError('transactionId', 'Transaction ID is required');
        const element = document.getElementById('transactionId');
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!values.paymentScreenshot) {
        form.setFieldError('paymentScreenshot', 'Payment screenshot is required');
        const element = document.getElementById('paymentScreenshot');
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      await request(() => attendeeAPI.submitRegistration(values));
      setSubmitSuccess(true);

      setTimeout(() => {
        navigate('/thank-you'); // Consider a specific thank-you page if needed
      }, 1500);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.details) {
        const fieldErrors = {};
        let hasStep1Error = false;
        error.response.data.details.forEach((err) => {
          if (err.field) {
            fieldErrors[err.field] = err.message;
            if (['name', 'age', 'phone', 'email', 'linkedin', 'address', 'occupation', 'organization', 'designation', 'year', 'registrationNumber', 'source'].includes(err.field)) {
              hasStep1Error = true;
            }
          }
        });
        form.setErrors(fieldErrors);
        if (hasStep1Error) {
          setStep(1);
          setTimeout(() => {
            const firstErrorField = Object.keys(fieldErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
      console.error('Error submitting registration:', error);
    }
  };

  const form = useForm(initialValues, onSubmit);

  const handleNext = () => {
    form.setErrors({});
    let isValid = true;
    let firstErrorField = null;

    const checkError = (condition, field, message) => {
      if (condition) {
        form.setFieldError(field, message);
        isValid = false;
        if (!firstErrorField) firstErrorField = field;
      }
    };
    
    checkError(!form.values.name.trim() || form.values.name.trim().length < 2, 'name', 'Required (min 2 chars)');
    checkError(!form.values.age || parseInt(form.values.age) < 16, 'age', 'Must be at least 16');
    checkError(!form.values.phone.trim(), 'phone', 'Required');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    checkError(!emailRegex.test(form.values.email), 'email', 'Invalid email');
    checkError(!form.values.linkedin.trim(), 'linkedin', 'Required');
    checkError(!form.values.address.trim(), 'address', 'Required');
    checkError(!form.values.occupation, 'occupation', 'Required');
    if (form.values.occupation) {
      checkError(!form.values.organization.trim(), 'organization', 'Required');
      checkError(!form.values.designation.trim(), 'designation', 'Required');
    }
    if (form.values.occupation === 'Student') {
      checkError(!form.values.year.trim(), 'year', 'Required');
      checkError(!form.values.registrationNumber.trim(), 'registrationNumber', 'Required');
    }
    checkError(!form.values.source, 'source', 'Required');

    if (isValid) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (firstErrorField) {
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      form.setFieldError('paymentScreenshot', 'File size exceeds the 5 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setFieldValue('paymentScreenshot', reader.result);
      form.setFieldError('paymentScreenshot', '');
    };
    reader.readAsDataURL(file);
  };

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ted-red"></div>
        <p className="text-gray-400 text-xs animate-pulse">Connecting to server, please wait...</p>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16 relative overflow-hidden flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl shadow-red-900/20"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Connection Error</h2>
            <button
              onClick={checkStatus}
              className="w-full btn-primary py-3 font-semibold rounded-xl bg-ted-red hover:bg-red-700 transition-colors text-white"
            >
              Retry Connection
            </button>
          </motion.div>
        </div>
        <Footer />
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
            <span className="text-3xl">🎟️</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Registration Closed</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your interest! Event ticket registrations are currently closed. Stay tuned for future updates.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary py-3 font-semibold bg-ted-red text-white"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getOccupationLabels = () => {
    switch (form.values.occupation) {
      case 'Student':
        return { orgLabel: 'College / University *', orgPlaceholder: 'e.g. Kalasalingam University', desLabel: 'Stream / Course *', desPlaceholder: 'e.g. B.Tech CSE' };
      case 'Faculty':
        return { orgLabel: 'College / University Name *', orgPlaceholder: 'e.g. Kalasalingam University', desLabel: 'Department & Designation *', desPlaceholder: 'e.g. CSE - Asst. Professor' };
      case 'Founder / Entrepreneur':
        return { orgLabel: 'Company / Startup Name *', orgPlaceholder: 'e.g. Acme Corp', desLabel: 'Industry / Sector *', desPlaceholder: 'e.g. Technology' };
      case 'Business Professional':
        return { orgLabel: 'Company Name *', orgPlaceholder: 'e.g. Google', desLabel: 'Job Role / Designation *', desPlaceholder: 'e.g. Software Engineer' };
      default:
        return { orgLabel: 'Organization / Institution (if any) *', orgPlaceholder: 'e.g. Freelance', desLabel: 'Occupation Details *', desPlaceholder: 'Please specify your role' };
    }
  };
  const labels = getOccupationLabels();

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 relative overflow-hidden">
      <Navbar />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-ted-red/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section text-center mb-8 relative z-10"
      >
        <button
          onClick={() => navigate('/')}
          className="inline-block text-ted-red hover:text-red-600 font-semibold mb-4"
        >
          ← Back to Home
        </button>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Event <span className="text-ted-red font-bold">Registration</span></h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Secure your spot for the upcoming TEDxKARE "THE BIGBANG" event. Fill out the form below to register.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl mx-auto px-4 md:px-0 relative z-10"
      >
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-green-900/30 border border-green-500/50 rounded-lg text-green-300 text-center"
          >
            <p className="font-semibold">✓ Registration submitted successfully!</p>
            <p className="text-sm mt-2">Redirecting to confirmation page...</p>
          </motion.div>
        )}

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
            <button onClick={clearError} className="text-red-300 hover:text-red-200 font-bold">✕</button>
          </motion.div>
        )}

        <form onSubmit={form.handleSubmit} className="space-y-8">
          
          {/* STEP 1 */}
          {step === 1 && (
            <>
              {/* SECTION 1: PERSONAL DETAILS */}
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-2xl font-bold mb-6 text-ted-red">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group md:col-span-2">
                <label htmlFor="name" className="form-label">Full Name *</label>
                <input type="text" id="name" name="name" className="input-field" value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="Your full name" />
                {form.errors.name && <p className="form-error">{form.errors.name}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="age" className="form-label">Age *</label>
                <input type="number" id="age" name="age" className="input-field" value={form.values.age} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="e.g. 20" min="16" />
                {form.errors.age && <p className="form-error">{form.errors.age}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number *</label>
                <input type="tel" id="phone" name="phone" className="input-field" value={form.values.phone} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="10-digit number" />
                {form.errors.phone && <p className="form-error">{form.errors.phone}</p>}
              </div>
              <div className="form-group md:col-span-2">
                <label htmlFor="email" className="form-label">Email ID *</label>
                <input type="email" id="email" name="email" className="input-field" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="your@email.com" />
                {form.errors.email && <p className="form-error">{form.errors.email}</p>}
              </div>
              <div className="form-group md:col-span-2">
                <label htmlFor="linkedin" className="form-label">LinkedIn Profile *</label>
                <input type="url" id="linkedin" name="linkedin" className="input-field" value={form.values.linkedin} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="https://linkedin.com/in/..." />
                {form.errors.linkedin && <p className="form-error">{form.errors.linkedin}</p>}
              </div>
              <div className="form-group md:col-span-2">
                <label htmlFor="address" className="form-label">Address *</label>
                <textarea id="address" name="address" rows="3" className="input-field resize-none" value={form.values.address} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="Your residential or hostel address" />
                {form.errors.address && <p className="form-error">{form.errors.address}</p>}
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: ACADEMIC / PROFESSIONAL DETAILS */}
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-2xl font-bold mb-6 text-ted-red">Academic / Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group md:col-span-2">
                <label htmlFor="occupation" className="form-label">Occupation *</label>
                <select id="occupation" name="occupation" className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")` }} value={form.values.occupation} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading}>
                  <option value="">Select Occupation</option>
                  {occupations.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                </select>
                {form.errors.occupation && <p className="form-error">{form.errors.occupation}</p>}
              </div>

              {form.values.occupation && (
                <>
                  <div className="form-group md:col-span-2">
                    <label htmlFor="organization" className="form-label">{labels.orgLabel}</label>
                    <input type="text" id="organization" name="organization" className="input-field" value={form.values.organization} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder={labels.orgPlaceholder} />
                    {form.errors.organization && <p className="form-error">{form.errors.organization}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="designation" className="form-label">{labels.desLabel}</label>
                    <input type="text" id="designation" name="designation" className="input-field" value={form.values.designation} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder={labels.desPlaceholder} />
                    {form.errors.designation && <p className="form-error">{form.errors.designation}</p>}
                  </div>
                  {form.values.occupation === 'Student' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="year" className="form-label">Year of Study *</label>
                        <input type="text" id="year" name="year" className="input-field" value={form.values.year} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="e.g. 2nd Year" />
                        {form.errors.year && <p className="form-error">{form.errors.year}</p>}
                      </div>
                      <div className="form-group md:col-span-2">
                        <label htmlFor="registrationNumber" className="form-label">College Registration Number *</label>
                        <input type="text" id="registrationNumber" name="registrationNumber" className="input-field" value={form.values.registrationNumber} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="Enter your registration number" />
                        {form.errors.registrationNumber && <p className="form-error">{form.errors.registrationNumber}</p>}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* SECTION 3: EVENT DETAILS */}
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-2xl font-bold mb-6 text-ted-red">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group md:col-span-2">
                <label htmlFor="source" className="form-label">How did you hear about TEDxKARE? *</label>
                <select id="source" name="source" className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")` }} value={form.values.source} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading}>
                  <option value="">Select Source</option>
                  {sources.map(src => <option key={src} value={src}>{src}</option>)}
                </select>
                {form.errors.source && <p className="form-error">{form.errors.source}</p>}
              </div>
            </div>
          </motion.div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              {/* SECTION 4: PAYMENT DETAILS */}
              <motion.div variants={itemVariants} className="card">
                <h3 className="text-2xl font-bold mb-2 text-ted-red">Payment Details</h3>
                <p className="text-gray-300 text-lg mb-6">Ticket Price: <span className="font-bold text-white text-xl">₹399</span></p>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3 text-center">
                <p className="text-gray-300 mb-4 text-sm font-semibold">Scan to Pay</p>
                <div className="bg-white p-2 rounded-xl inline-block">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=your-upi-id" alt="Payment QR Code" className="w-40 h-40" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Replace with actual QR code</p>
              </div>
              <div className="w-full md:w-2/3 space-y-6">
                <div className="form-group">
                  <label htmlFor="transactionId" className="form-label">Transaction ID *</label>
                  <input type="text" id="transactionId" name="transactionId" className="input-field" value={form.values.transactionId} onChange={form.handleChange} onBlur={form.handleBlur} required disabled={loading} placeholder="Enter your transaction ID" />
                  {form.errors.transactionId && <p className="form-error">{form.errors.transactionId}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="paymentScreenshot" className="form-label">Payment Screenshot *</label>
                  <input type="file" id="paymentScreenshot" name="paymentScreenshot" accept="image/*" className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ted-red file:text-white hover:file:bg-red-700" onChange={handleFileChange} required disabled={loading} />
                  {form.errors.paymentScreenshot && <p className="form-error">{form.errors.paymentScreenshot}</p>}
                  {form.values.paymentScreenshot && <p className="text-green-500 text-xs mt-1">✓ Screenshot attached</p>}
                </div>
              </div>
            </div>
          </motion.div>
            </>
          )}

          <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
            <input type="text" name="website" value={form.values.website} onChange={form.handleChange} tabIndex="-1" autoComplete="off" />
          </div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-8">
            {step === 1 ? (
              <>
                <button type="button" onClick={handleNext} className="btn-primary flex-1 py-4 text-lg font-semibold bg-ted-red text-white">Next</button>
                <button type="button" onClick={() => navigate('/')} className="btn-outline flex-1 py-4 text-lg font-semibold">Cancel</button>
              </>
            ) : (
              <>
                <button type="submit" disabled={loading || submitSuccess} className="btn-primary flex-1 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-ted-red text-white">
                  {loading ? '⏳ Submitting...' : submitSuccess ? '✓ Registered' : 'Register Now'}
                </button>
                <button type="button" onClick={() => { setStep(1); window.scrollTo(0,0); }} className="btn-outline flex-1 py-4 text-lg font-semibold">Back</button>
              </>
            )}
          </motion.div>

        </form>
      </motion.div>

      <Footer />
    </div>
  );
};

export default AttendeeApply;
