import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useApi } from '../hooks/useApi';
import { attendeeAPI, settingsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const departments = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'Biomedical Engineering',
  'Chemical Engineering',
  'Automobile Engineering',
  'School of Computing / AI & Data Science',
  'School of Architecture (KSoA)',
  'School of Agricultural Sciences',
  'Kalasalingam Business School (MBA)',
  'Commerce / B.Com',
  'Science and Humanities',
  'Other',
];

const externalCategories = [
  'Student',
  'Founder',
  'Faculty',
  'Business Professional',
  'Other',
];

const AttendeeApply = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, request, clearError } = useApi();

  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [internalSlots, setInternalSlots] = useState(60);
  const [externalSlots, setExternalSlots] = useState(40);
  const [isInternalFull, setIsInternalFull] = useState(false);
  const [isExternalFull, setIsExternalFull] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const checkStatus = async () => {
    setConnectionError(false);
    setIsCheckingStatus(true);
    let attempts = 50;
    while (attempts > 0) {
      try {
        const response = await settingsAPI.getSettings({ timeout: 4000 });
        const data = response.data?.data || response.data;
        setRegistrationOpen(data.attendeeRegistrationOpen ?? data.registrationOpen ?? true);

        const intLimit = data.internalAttendeeLimit ?? 60;
        const extLimit = data.externalAttendeeLimit ?? 40;
        setInternalSlots(intLimit);
        setExternalSlots(extLimit);

        const intFull = data.isInternalFull ?? false;
        const extFull = data.isExternalFull ?? false;
        setIsInternalFull(intFull);
        setIsExternalFull(extFull);

        if (intFull && !extFull) {
          form.setFieldValue('ticketType', 'External');
        } else if (!intFull && extFull) {
          form.setFieldValue('ticketType', 'Internal');
        }

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
    ticketType: 'Internal', // 'Internal' or 'External'

    // Common
    name: '',
    email: '',
    phone: '',
    linkedin: '',

    // Internal Ticket Specific
    registrationNumber: '',
    department: '',
    hostelDayScholar: 'Hostel',
    hostelName: '',
    wardenContact: '',
    roomNumber: '',

    // External Ticket Specific
    address: '',
    category: '',
    organization: '',

    // Payment Step
    transactionId: '',
    paymentScreenshot: '',
    website: '', // Honeypot
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };

  const onSubmit = async (values) => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        form.setFieldError('email', 'Valid email ID is required');
        return;
      }
      if (!values.transactionId.trim()) {
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
        navigate('/thank-you');
      }, 1500);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.details) {
        const fieldErrors = {};
        let hasStep1Error = false;
        const step1Fields = [
          'name',
          'email',
          'phone',
          'linkedin',
          'registrationNumber',
          'department',
          'hostelDayScholar',
          'hostelName',
          'wardenContact',
          'roomNumber',
          'address',
          'category',
          'organization',
        ];

        error.response.data.details.forEach((err) => {
          if (err.field) {
            fieldErrors[err.field] = err.message;
            if (step1Fields.includes(err.field)) {
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
      } else if (error.response?.status === 409) {
        const errorMsg = error.response?.data?.message || 'Already registered';
        const errType = error.response?.data?.error;
        if (errType?.includes('Registration number') || errorMsg?.toLowerCase().includes('registration number')) {
          form.setFieldError('registrationNumber', errorMsg);
          setStep(1);
          setTimeout(() => {
            const element = document.getElementById('registrationNumber');
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else {
          form.setFieldError('email', errorMsg);
          setStep(1);
          setTimeout(() => {
            const element = document.getElementById('email');
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
      console.error('Error submitting registration:', error);
    }
  };

  const form = useForm(initialValues, onSubmit);

  const handleInputChange = (e) => {
    if (error) clearError();
    form.handleChange(e);
  };

  const handleNext = async () => {
    if (error) clearError();
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

    // Common validations
    checkError(!form.values.name.trim() || form.values.name.trim().length < 2, 'name', 'Full name is required (min 2 characters)');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    checkError(!emailRegex.test(form.values.email), 'email', 'Valid email ID is required');
    const phoneRegex = /^[0-9+\s()-]{10,15}$/;
    checkError(!form.values.phone.trim() || !phoneRegex.test(form.values.phone.trim()), 'phone', 'Valid 10-digit mobile number is required');

    // Conditional validations based on Ticket Type
    if (form.values.ticketType === 'Internal') {
      checkError(!form.values.registrationNumber.trim(), 'registrationNumber', 'Registration number is required');
      checkError(!form.values.department.trim(), 'department', 'Department is required');
      checkError(!form.values.hostelDayScholar, 'hostelDayScholar', 'Please select Hostel or Day Scholar');

      if (form.values.hostelDayScholar === 'Hostel') {
        checkError(!form.values.hostelName.trim(), 'hostelName', 'Hostel name is required');
        checkError(!form.values.wardenContact.trim(), 'wardenContact', 'Warden contact number is required');
        checkError(!form.values.roomNumber.trim(), 'roomNumber', 'Room number is required');
      }
    } else {
      checkError(!form.values.address.trim(), 'address', 'Address is required');
      checkError(!form.values.category, 'category', 'Please select a category');
      checkError(!form.values.organization.trim(), 'organization', 'Organization / Startup / Company Name is required');
    }

    if (form.values.ticketType === 'Internal' && isInternalFull) {
      form.setFieldError('name', 'Internal ticket slots for KARE students are completely full.');
      return;
    }
    if (form.values.ticketType === 'External' && isExternalFull) {
      form.setFieldError('name', 'External ticket slots are completely full.');
      return;
    }

    // Stop if any client-side format checks fail
    if (!isValid) {
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    // Pre-flight check: verify email and registration number uniqueness
    try {
      setIsCheckingAvailability(true);
      const res = await attendeeAPI.checkAvailability({
        email: form.values.email,
        registrationNumber: form.values.ticketType === 'Internal' ? form.values.registrationNumber : undefined,
        ticketType: form.values.ticketType,
      });

      const availability = res.data?.data;
      let duplicateFound = false;

      if (availability?.emailExists) {
        form.setFieldError('email', 'An attendee with this email is already registered.');
        duplicateFound = true;
        if (!firstErrorField) firstErrorField = 'email';
      }

      if (availability?.registrationNumberExists) {
        form.setFieldError('registrationNumber', 'A student with this registration number is already registered.');
        duplicateFound = true;
        if (!firstErrorField) firstErrorField = 'registrationNumber';
      }

      if (duplicateFound) {
        if (firstErrorField) {
          const errorElement = document.getElementById(firstErrorField);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return; // BLOCK MOVING TO PAYMENT PAGE
      }

      // Valid and unique - proceed to payment
      setStep(2);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error verifying registration availability:', err);
      // Fallback on network timeout
      setStep(2);
      window.scrollTo(0, 0);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      form.setFieldError('paymentScreenshot', 'File size exceeds the 5 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setFieldValue('paymentScreenshot', reader.result);
      if (error) clearError();
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

  if (!registrationOpen || (isInternalFull && isExternalFull)) {
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
          <h2 className="text-3xl font-bold mb-4">Registration Full & Closed</h2>
          <p className="text-gray-400 mb-8">
            Thank you for your interest! All internal ({internalSlots}) and external ({externalSlots}) ticket slots for TEDxKARE "THE BIGBANG" have been completely filled. Stay tuned for future announcements.
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Event <span className="text-ted-red font-bold">Registration</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Secure your pass for TEDxKARE "THE BIGBANG". Select your ticket category below to get started.
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
            <p className="font-semibold text-lg">✓ Registration submitted successfully!</p>
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
            <button onClick={clearError} className="text-red-300 hover:text-red-200 font-bold text-lg">✕</button>
          </motion.div>
        )}

        <form onSubmit={form.handleSubmit} className="space-y-8">
          {/* STEP 1: TICKET SELECTION & INFORMATION */}
          {step === 1 && (
            <>
              {/* TICKET TYPE SELECTOR */}
              <motion.div variants={itemVariants} className="card">
                <h3 className="text-2xl font-bold mb-3 text-ted-red">Select Ticket Type</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Please pick whether you are an internal student of Kalasalingam University or an external attendee.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Internal Ticket Card */}
                  <button
                    type="button"
                    disabled={isInternalFull}
                    onClick={() => {
                      if (isInternalFull) return;
                      if (error) clearError();
                      form.setFieldValue('ticketType', 'Internal');
                      form.setErrors({});
                    }}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between group ${
                      isInternalFull
                        ? 'bg-gray-900/40 border-gray-800 opacity-40 cursor-not-allowed'
                        : form.values.ticketType === 'Internal'
                        ? 'bg-gradient-to-br from-red-950/50 via-gray-900 to-black border-ted-red shadow-xl shadow-red-900/20 ring-2 ring-ted-red/60'
                        : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isInternalFull
                          ? 'bg-red-950/60 text-red-400 border-red-500/40'
                          : 'bg-ted-red/20 text-ted-red border-ted-red/40'
                      }`}>
                        {isInternalFull ? '🔴 Sold Out (Full)' : `🎓 KARE Students (${internalSlots} Slots)`}
                      </span>
                      {form.values.ticketType === 'Internal' && !isInternalFull && (
                        <span className="w-6 h-6 rounded-full bg-ted-red text-white flex items-center justify-center text-xs font-bold shadow-md shadow-ted-red/50">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">Internal Ticket</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {isInternalFull
                          ? 'All internal student passes for KARE campus have been filled.'
                          : 'For currently enrolled Kalasalingam (KARE) university students.'}
                      </p>
                    </div>
                  </button>

                  {/* External Ticket Card */}
                  <button
                    type="button"
                    disabled={isExternalFull}
                    onClick={() => {
                      if (isExternalFull) return;
                      if (error) clearError();
                      form.setFieldValue('ticketType', 'External');
                      form.setErrors({});
                    }}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between group ${
                      isExternalFull
                        ? 'bg-gray-900/40 border-gray-800 opacity-40 cursor-not-allowed'
                        : form.values.ticketType === 'External'
                        ? 'bg-gradient-to-br from-red-950/50 via-gray-900 to-black border-ted-red shadow-xl shadow-red-900/20 ring-2 ring-ted-red/60'
                        : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isExternalFull
                          ? 'bg-red-950/60 text-red-400 border-red-500/40'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      }`}>
                        {isExternalFull ? '🔴 Sold Out (Full)' : `🌐 General / Outside (${externalSlots} Slots)`}
                      </span>
                      {form.values.ticketType === 'External' && !isExternalFull && (
                        <span className="w-6 h-6 rounded-full bg-ted-red text-white flex items-center justify-center text-xs font-bold shadow-md shadow-ted-red/50">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">External Ticket</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {isExternalFull
                          ? 'All general / external attendee passes have been filled.'
                          : 'For students of other institutions, founders, faculty, professionals & guests.'}
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* INTERNAL TICKET DETAILS */}
              {form.values.ticketType === 'Internal' ? (
                <motion.div variants={itemVariants} className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-ted-red">Internal Ticket — Student Details</h3>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-ted-red/10 text-ted-red border border-ted-red/20 font-mono">
                      KARE Campus
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`input-field ${form.errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.name}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="e.g. John Doe"
                      />
                      {form.errors.name && <p className="form-error">{form.errors.name}</p>}
                    </div>

                    {/* Registration Number */}
                    <div className="form-group">
                      <label htmlFor="registrationNumber" className="form-label">Registration Number *</label>
                      <input
                        type="text"
                        id="registrationNumber"
                        name="registrationNumber"
                        className={`input-field ${form.errors.registrationNumber ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.registrationNumber}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="e.g. 9921004123"
                      />
                      {form.errors.registrationNumber && <p className="form-error">{form.errors.registrationNumber}</p>}
                    </div>

                    {/* Email ID */}
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email ID *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`input-field ${form.errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.email}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="yourname@klu.ac.in"
                      />
                      {form.errors.email && <p className="form-error">{form.errors.email}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`input-field ${form.errors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.phone}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="10-digit mobile number"
                      />
                      {form.errors.phone && <p className="form-error">{form.errors.phone}</p>}
                    </div>

                    {/* Department */}
                    <div className="form-group">
                      <label htmlFor="department" className="form-label">Department *</label>
                      <select
                        id="department"
                        name="department"
                        className={`input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10 ${
                          form.errors.department ? 'border-red-500 ring-1 ring-red-500' : ''
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        }}
                        value={form.values.department}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                      >
                        <option value="">Select your department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {form.errors.department && <p className="form-error">{form.errors.department}</p>}
                    </div>

                    {/* Hostel / Day Scholar Selector */}
                    <div className="form-group md:col-span-2">
                      <label className="form-label mb-2 block">Hostel / Day Scholar *</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (error) clearError();
                            form.setFieldValue('hostelDayScholar', 'Hostel');
                          }}
                          className={`py-3 px-4 rounded-xl border text-center font-semibold transition-all ${
                            form.values.hostelDayScholar === 'Hostel'
                              ? 'bg-ted-red text-white border-ted-red shadow-lg shadow-ted-red/20'
                              : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          🏨 Hosteller
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (error) clearError();
                            form.setFieldValue('hostelDayScholar', 'Day Scholar');
                          }}
                          className={`py-3 px-4 rounded-xl border text-center font-semibold transition-all ${
                            form.values.hostelDayScholar === 'Day Scholar'
                              ? 'bg-ted-red text-white border-ted-red shadow-lg shadow-ted-red/20'
                              : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          🚌 Day Scholar
                        </button>
                      </div>
                      {form.errors.hostelDayScholar && <p className="form-error">{form.errors.hostelDayScholar}</p>}
                    </div>

                    {/* Conditional Hostel Fields */}
                    {form.values.hostelDayScholar === 'Hostel' && (
                      <div className="md:col-span-2 p-5 bg-black/40 border border-gray-800/80 rounded-2xl space-y-4">
                        <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                          Hostel Accommodation Details
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="form-group">
                            <label htmlFor="hostelName" className="form-label">Hostel Name *</label>
                            <input
                              type="text"
                              id="hostelName"
                              name="hostelName"
                              className={`input-field ${form.errors.hostelName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                              value={form.values.hostelName}
                              onChange={handleInputChange}
                              onBlur={form.handleBlur}
                              required
                              disabled={loading}
                              placeholder="e.g. MH-1 / LH-2"
                            />
                            {form.errors.hostelName && <p className="form-error">{form.errors.hostelName}</p>}
                          </div>

                          <div className="form-group">
                            <label htmlFor="roomNumber" className="form-label">Room Number *</label>
                            <input
                              type="text"
                              id="roomNumber"
                              name="roomNumber"
                              className={`input-field ${form.errors.roomNumber ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                              value={form.values.roomNumber}
                              onChange={handleInputChange}
                              onBlur={form.handleBlur}
                              required
                              disabled={loading}
                              placeholder="e.g. 304"
                            />
                            {form.errors.roomNumber && <p className="form-error">{form.errors.roomNumber}</p>}
                          </div>

                          <div className="form-group">
                            <label htmlFor="wardenContact" className="form-label">Warden Contact Number *</label>
                            <input
                              type="tel"
                              id="wardenContact"
                              name="wardenContact"
                              className={`input-field ${form.errors.wardenContact ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                              value={form.values.wardenContact}
                              onChange={handleInputChange}
                              onBlur={form.handleBlur}
                              required
                              disabled={loading}
                              placeholder="10-digit number"
                            />
                            {form.errors.wardenContact && <p className="form-error">{form.errors.wardenContact}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Profile */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="linkedin" className="form-label">
                        LinkedIn Profile <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        className={`input-field ${form.errors.linkedin ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.linkedin}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        disabled={loading}
                        placeholder="https://linkedin.com/in/yourprofile (optional)"
                      />
                      {form.errors.linkedin && <p className="form-error">{form.errors.linkedin}</p>}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* EXTERNAL TICKET DETAILS */
                <motion.div variants={itemVariants} className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-ted-red">External Ticket — Attendee Details</h3>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      Guest / External
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`input-field ${form.errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.name}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="Your full name"
                      />
                      {form.errors.name && <p className="form-error">{form.errors.name}</p>}
                    </div>

                    {/* Email ID */}
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email ID *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`input-field ${form.errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.email}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="your.email@example.com"
                      />
                      {form.errors.email && <p className="form-error">{form.errors.email}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`input-field ${form.errors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.phone}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="10-digit mobile number"
                      />
                      {form.errors.phone && <p className="form-error">{form.errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="address" className="form-label">Address *</label>
                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        className={`input-field resize-none ${form.errors.address ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.address}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="Your complete residential or office address"
                      />
                      {form.errors.address && <p className="form-error">{form.errors.address}</p>}
                    </div>

                    {/* Category */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="category" className="form-label">Category *</label>
                      <select
                        id="category"
                        name="category"
                        className={`input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10 ${
                          form.errors.category ? 'border-red-500 ring-1 ring-red-500' : ''
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        }}
                        value={form.values.category}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                      >
                        <option value="">Select your category</option>
                        {externalCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {form.errors.category && <p className="form-error">{form.errors.category}</p>}
                    </div>

                    {/* Organization / Startup / Company Name */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="organization" className="form-label">
                        Organization / Startup / Company Name *
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        className={`input-field ${form.errors.organization ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.organization}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="e.g. Acme Tech / University Name"
                      />
                      {form.errors.organization && <p className="form-error">{form.errors.organization}</p>}
                    </div>

                    {/* LinkedIn Profile */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="linkedin" className="form-label">
                        LinkedIn Profile <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        className={`input-field ${form.errors.linkedin ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        value={form.values.linkedin}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        disabled={loading}
                        placeholder="https://linkedin.com/in/yourprofile (optional)"
                      />
                      {form.errors.linkedin && <p className="form-error">{form.errors.linkedin}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* STEP 2: PAYMENT VERIFICATION */}
          {step === 2 && (
            <motion.div variants={itemVariants} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-ted-red">Payment Details</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-ted-red/20 text-ted-red border border-ted-red/30 font-bold">
                  {form.values.ticketType === 'Internal' ? 'Internal Ticket' : 'External Ticket'}
                </span>
              </div>

              <p className="text-gray-300 text-lg mb-6">
                Ticket Price: <span className="font-bold text-white text-xl">₹399</span>
              </p>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 text-center">
                  <p className="text-gray-300 mb-4 text-sm font-semibold">Scan to Pay via UPI</p>
                  <div className="bg-white p-2 rounded-xl inline-block shadow-lg">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=your-upi-id"
                      alt="Payment QR Code"
                      className="w-40 h-40"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Scan with GPay, PhonePe, Paytm or any UPI App</p>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div className="form-group">
                    <label htmlFor="transactionId" className="form-label">Transaction ID / UTR *</label>
                    <input
                      type="text"
                      id="transactionId"
                      name="transactionId"
                      className={`input-field ${form.errors.transactionId ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                      value={form.values.transactionId}
                      onChange={handleInputChange}
                      onBlur={form.handleBlur}
                      required
                      disabled={loading}
                      placeholder="Enter 12-digit UPI reference ID or Transaction ID"
                    />
                    {form.errors.transactionId && <p className="form-error">{form.errors.transactionId}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="paymentScreenshot" className="form-label">Payment Screenshot *</label>
                    {form.values.paymentScreenshot ? (
                      <div className="border border-green-500/40 bg-black/60 p-4 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={form.values.paymentScreenshot}
                            alt="Payment Proof"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-700 shadow-md shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-green-400 font-semibold text-sm flex items-center gap-1">
                              ✓ Screenshot Attached
                            </p>
                            <p className="text-gray-400 text-xs truncate mt-0.5">Image proof ready for verification</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <label
                            htmlFor="paymentScreenshot"
                            className="cursor-pointer px-3 py-2 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
                          >
                            Change File
                          </label>
                          <button
                            type="button"
                            onClick={() => form.setFieldValue('paymentScreenshot', '')}
                            className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors"
                            title="Remove attached screenshot"
                          >
                            ✕
                          </button>
                          <input
                            type="file"
                            id="paymentScreenshot"
                            name="paymentScreenshot"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="paymentScreenshot"
                          name="paymentScreenshot"
                          accept="image/*"
                          className={`input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ted-red file:text-white hover:file:bg-red-700 cursor-pointer ${
                            form.errors.paymentScreenshot ? 'border-red-500 ring-1 ring-red-500' : ''
                          }`}
                          onChange={handleFileChange}
                          disabled={loading}
                        />
                      </div>
                    )}
                    {form.errors.paymentScreenshot && <p className="form-error">{form.errors.paymentScreenshot}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Honeypot for spam bots */}
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

          {/* Step Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-8">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  disabled={isCheckingAvailability}
                  onClick={handleNext}
                  className="btn-primary flex-1 py-4 text-lg font-semibold bg-ted-red hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-ted-red/20 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isCheckingAvailability ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Checking details...
                    </>
                  ) : (
                    'Proceed to Payment →'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn-outline flex-1 py-4 text-lg font-semibold rounded-xl border border-gray-700 hover:border-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={loading || submitSuccess}
                  className="btn-primary flex-1 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-ted-red hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-ted-red/20"
                >
                  {loading ? '⏳ Submitting...' : submitSuccess ? '✓ Registered' : 'Confirm Registration'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    window.scrollTo(0, 0);
                  }}
                  className="btn-outline flex-1 py-4 text-lg font-semibold rounded-xl border border-gray-700 hover:border-gray-500"
                >
                  ← Back to Details
                </button>
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
