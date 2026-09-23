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
  const [timeLeft, setTimeLeft] = useState(300);
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
  const [queuePosition, setQueuePosition] = useState(null);

  const checkStatus = async (isPolling = false) => {
    if (!isPolling) {
      setConnectionError(false);
      setIsCheckingStatus(true);
    }
    let attempts = isPolling ? 1 : 50;
    while (attempts > 0) {
      try {
        const response = await settingsAPI.getSettings({ timeout: 4000 });
        const data = response.data?.data || response.data;
        if (!isPolling) setRegistrationOpen(data.attendeeRegistrationOpen ?? data.registrationOpen ?? true);

        const intLimit = data.internalAvailable ?? data.internalAttendeeLimit ?? 60;
        const extLimit = data.externalAvailable ?? data.externalAttendeeLimit ?? 40;
        setInternalSlots(intLimit);
        setExternalSlots(extLimit);

        const intFull = data.isInternalFull ?? false;
        const extFull = data.isExternalFull ?? false;
        setIsInternalFull(intFull);
        setIsExternalFull(extFull);

        if (!isPolling) {
          if (intFull && !extFull) {
            form.setFieldValue('ticketType', 'External');
          } else if (!intFull && extFull) {
            form.setFieldValue('ticketType', 'Internal');
          }
          setIsCheckingStatus(false);
        }
        return;
      } catch (err) {
        attempts--;
        if (!isPolling) {
          console.error(`Failed to fetch registration status. Remaining attempts: ${attempts}`, err);
          if (attempts > 0) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }
      }
    }
    if (!isPolling) {
      setConnectionError(true);
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    checkStatus();
    
    // Auto-refresh seat availability for the virtual queue
    const interval = setInterval(() => {
      if (step === 1) checkStatus(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [step]);



  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeLow = timeLeft <= 120; // 2 minutes or less
  const progressPercentage = (timeLeft / 300) * 100;

  const initialValues = {
    ticketType: 'Internal', // 'Internal' or 'External'

    // Common
    name: '',
    gender: '',
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
        setStep(1);
        setTimeout(() => {
          const element = document.getElementById('email');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus?.();
          }
        }, 100);
        return;
      }
      if (!values.transactionId.trim()) {
        form.setFieldError('transactionId', 'Transaction ID / UTR is required');
        const element = document.getElementById('transactionId');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus?.();
        }
        return;
      }
      if (!values.paymentScreenshot) {
        form.setFieldError('paymentScreenshot', 'Payment screenshot proof is required');
        const element = document.getElementById('paymentScreenshot');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Clean payload to prevent Mongoose enum/validation errors on empty strings
      const payload = { ...values };
      if (payload.ticketType === 'Internal') {
        delete payload.address;
        delete payload.category;
        delete payload.organization;
      } else {
        delete payload.registrationNumber;
        delete payload.department;
        delete payload.hostelDayScholar;
        delete payload.hostelName;
        delete payload.wardenContact;
        delete payload.roomNumber;
      }

      await request(() => attendeeAPI.submitRegistration(payload));
      setSubmitSuccess(true);

      setTimeout(() => {
        navigate('/thank-you', { state: { registrationComplete: true, ticketType: payload.ticketType } });
      }, 1500);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.details) {
        clearError();
        const fieldErrors = {};
        let hasStep1Error = false;
        let hasStep2Error = false;
        const step1Fields = [
          'name',
          'gender',
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
        const step2Fields = ['transactionId', 'paymentScreenshot'];

        error.response.data.details.forEach((err) => {
          if (err.field) {
            fieldErrors[err.field] = err.message;
            if (step1Fields.includes(err.field)) {
              hasStep1Error = true;
            }
            if (step2Fields.includes(err.field)) {
              hasStep2Error = true;
            }
          }
        });
        form.setErrors(fieldErrors);
        if (hasStep1Error) {
          setStep(1);
          setTimeout(() => {
            const firstErrorField = Object.keys(fieldErrors).find((f) => step1Fields.includes(f));
            const element = document.getElementById(firstErrorField);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus?.();
            }
          }, 150);
        } else if (hasStep2Error) {
          setStep(2);
          setTimeout(() => {
            const firstErrorField = Object.keys(fieldErrors).find((f) => step2Fields.includes(f));
            const element = document.getElementById(firstErrorField);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus?.();
            }
          }, 150);
        }
      } else if (error.response?.status === 409) {
        clearError();
        const errorMsg = error.response?.data?.message || 'Already registered';
        const errType = error.response?.data?.error || '';
        if (errType.toLowerCase().includes('registration') || errorMsg.toLowerCase().includes('registration number')) {
          form.setFieldError('registrationNumber', errorMsg);
          setStep(1);
          setTimeout(() => {
            const element = document.getElementById('registrationNumber');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus?.();
            }
          }, 150);
        } else {
          form.setFieldError('email', errorMsg);
          setStep(1);
          setTimeout(() => {
            const element = document.getElementById('email');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus?.();
            }
          }, 150);
        }
      }
      console.error('Error submitting registration:', error);
    }
  };

  const form = useForm(initialValues, onSubmit);

  useEffect(() => {
    let timerId;
    if (step === 2 && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (step === 2 && timeLeft === 0) {
      // Time expired! Release lock and go back
      if (form.values.email) {
        attendeeAPI.releaseReservation(form.values.email).catch(console.error);
      }
      form.setFieldError('email', 'Your payment session has expired. Your seat was released to the next person in line.');
      setStep(1);
      window.scrollTo(0, 0);
    } else if (step === 1) {
      setTimeLeft(300);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [step, timeLeft, form.values.email]);

  useEffect(() => {
    let interval;
    if (step === 1.5) {
      interval = setInterval(async () => {
        try {
          const payload = {
            email: form.values.email,
            ticketType: form.values.ticketType,
            registrationNumber: form.values.registrationNumber,
          };
          const res = await attendeeAPI.checkAvailability(payload);
          if (res.data?.data?.isFull) {
            form.setFieldError('email', res.data.data.message);
            setStep(1);
            checkStatus(true); // Update the ticket counts to show SOLD OUT
            window.scrollTo(0, 0);
          } else if (res.data?.data?.yourTurn) {
            setStep(2);
            if (timeLeft === 0) setTimeLeft(300);
            window.scrollTo(0, 0);
          } else if (res.data?.data?.seatsLocked) {
            setQueuePosition(res.data.data.queuePosition);
          }
        } catch (error) {
          console.error("Queue poll error:", error);
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [step, form.values.email, form.values.ticketType, form.values.registrationNumber, timeLeft]);

  const handleInputChange = (e) => {
    if (error) clearError();
    form.handleChange(e);
  };

  const handleNext = async () => {
    if (error) clearError();
    const newErrors = {};
    let firstErrorField = null;

    const checkError = (condition, field, message) => {
      if (condition) {
        newErrors[field] = message;
        if (!firstErrorField) firstErrorField = field;
      }
    };

    // Common validations
    checkError(!form.values.name.trim() || form.values.name.trim().length < 2, 'name', 'Full name is required (min 2 characters)');
    checkError(!form.values.gender, 'gender', 'Please select your gender');
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
      newErrors.name = 'Internal ticket slots for KARE students are completely full.';
      form.setErrors(newErrors);
      return;
    }
    if (form.values.ticketType === 'External' && isExternalFull) {
      newErrors.name = 'External ticket slots are completely full.';
      form.setErrors(newErrors);
      return;
    }

    // Stop if any client-side format checks fail
    if (Object.keys(newErrors).length > 0) {
      form.setErrors(newErrors);
      if (firstErrorField) {
        setTimeout(() => {
          const errorElement = document.getElementById(firstErrorField);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus?.();
          }
        }, 50);
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
      const dupErrors = {};
      let firstDupField = null;

      if (availability?.emailExists) {
        dupErrors.email = 'An attendee with this email is already registered.';
        if (!firstDupField) firstDupField = 'email';
      }

      if (availability?.registrationNumberExists) {
        dupErrors.registrationNumber = 'A student with this registration number is already registered.';
        if (!firstDupField) firstDupField = 'registrationNumber';
      }

      if (res.data?.data?.seatsLocked) {
        setQueuePosition(res.data.data.queuePosition);
        setStep(1.5);
        window.scrollTo(0, 0);
        return;
      }
      
      if (res.data?.data?.yourTurn) {
        form.setErrors({});
        if (timeLeft === 0) setTimeLeft(300);
        setStep(2);
        window.scrollTo(0, 0);
        return;
      }

      if (Object.keys(dupErrors).length > 0) {
        form.setErrors(dupErrors);
        if (firstDupField) {
          setTimeout(() => {
            const errorElement = document.getElementById(firstDupField);
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              errorElement.focus?.();
            }
          }, 50);
        }
        return; // BLOCK MOVING TO PAYMENT PAGE
      }

      // Valid and unique - proceed to payment
      form.setErrors({});
      if (timeLeft === 0) setTimeLeft(300);
      setStep(2);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error verifying registration availability:', err);
      // Fallback on network timeout
      form.setErrors({});
      if (timeLeft === 0) setTimeLeft(300);
      setStep(2);
      window.scrollTo(0, 0);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleBack = async () => {
    if (form.values.email) {
      try {
        await attendeeAPI.releaseReservation(form.values.email);
      } catch (err) {
        console.error('Failed to release reservation', err);
      }
    }
    form.resetForm();
    setStep(1);
    setTimeLeft(300);
    window.scrollTo(0, 0);
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
        <p className="text-gray-400 text-xs animate-pulse">TEDxKare Loading....</p>
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

        {/* System notification for unexpected server/network errors */}
        {error && Object.keys(form.errors).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-center justify-between backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-ted-red shrink-0"></span>
              <p className="text-xs sm:text-sm font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="text-gray-400 hover:text-white transition-colors text-xs p-1 ml-3"
            >
              ✕
            </button>
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
                        {isInternalFull ? '🔴 Sold Out (Full)' : `🎓 KARE Students (${internalSlots} seats available)`}
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
                    {internalSlots > 0 && internalSlots < 5 && !isInternalFull && (
                      <p className="mt-3 text-red-500 font-bold animate-pulse text-sm">Hurry up! Only {internalSlots} seats left!</p>
                    )}
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
                        {isExternalFull ? '🔴 Sold Out (Full)' : `🌐 General / Outside (${externalSlots} seats available)`}
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
                    {externalSlots > 0 && externalSlots < 5 && !isExternalFull && (
                      <p className="mt-3 text-blue-400 font-bold animate-pulse text-sm">Hurry up! Only {externalSlots} seats left!</p>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* TICKET DETAILS */}
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
                        className={`input-field ${form.errors.name ? 'input-error' : ''}`}
                        value={form.values.name}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="e.g. Your Name"
                      />
                      {form.errors.name && <p className="form-error">{form.errors.name}</p>}
                    </div>

                    {/* Gender */}
                    <div className="form-group">
                      <label htmlFor="gender" className="form-label">Gender *</label>
                      <select
                        id="gender"
                        name="gender"
                        className={`input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10 ${
                          form.errors.gender ? 'input-error' : ''
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        }}
                        value={form.values.gender}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                      >
                        <option value="">Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {form.errors.gender && <p className="form-error">{form.errors.gender}</p>}
                    </div>

                    {/* Registration Number */}
                    <div className="form-group">
                      <label htmlFor="registrationNumber" className="form-label">Registration Number *</label>
                      <input
                        type="text"
                        id="registrationNumber"
                        name="registrationNumber"
                        className={`input-field ${form.errors.registrationNumber ? 'input-error' : ''}`}
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
                        className={`input-field ${form.errors.email ? 'input-error' : ''}`}
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
                        className={`input-field ${form.errors.phone ? 'input-error' : ''}`}
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
                          form.errors.department ? 'input-error' : ''
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
                    <div id="hostelDayScholar" className="form-group md:col-span-2">
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
                      <>
                        <div className="form-group">
                          <label htmlFor="hostelName" className="form-label">Hostel Name *</label>
                          <input
                            type="text"
                            id="hostelName"
                            name="hostelName"
                            className={`input-field ${form.errors.hostelName ? 'input-error' : ''}`}
                            value={form.values.hostelName}
                            onChange={handleInputChange}
                            onBlur={form.handleBlur}
                            required
                            disabled={loading}
                            placeholder="e.g. MH A Block"
                          />
                          {form.errors.hostelName && <p className="form-error">{form.errors.hostelName}</p>}
                        </div>
                        <div className="form-group">
                          <label htmlFor="roomNumber" className="form-label">Room Number *</label>
                          <input
                            type="text"
                            id="roomNumber"
                            name="roomNumber"
                            className={`input-field ${form.errors.roomNumber ? 'input-error' : ''}`}
                            value={form.values.roomNumber}
                            onChange={handleInputChange}
                            onBlur={form.handleBlur}
                            required
                            disabled={loading}
                            placeholder="e.g. 101"
                          />
                          {form.errors.roomNumber && <p className="form-error">{form.errors.roomNumber}</p>}
                        </div>
                        <div className="form-group md:col-span-2">
                          <label htmlFor="wardenContact" className="form-label">Warden Contact Number *</label>
                          <input
                            type="tel"
                            id="wardenContact"
                            name="wardenContact"
                            className={`input-field ${form.errors.wardenContact ? 'input-error' : ''}`}
                            value={form.values.wardenContact}
                            onChange={handleInputChange}
                            onBlur={form.handleBlur}
                            required
                            disabled={loading}
                            placeholder="10-digit mobile number"
                          />
                          {form.errors.wardenContact && <p className="form-error">{form.errors.wardenContact}</p>}
                        </div>
                      </>
                    )}

                    {/* LinkedIn Profile */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="linkedin" className="form-label">LinkedIn Profile URL (Optional)</label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        className="input-field"
                        value={form.values.linkedin}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-ted-red">External Ticket — Attendee Details</h3>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      General / Outside
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
                        className={`input-field ${form.errors.name ? 'input-error' : ''}`}
                        value={form.values.name}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="e.g. Your Name"
                      />
                      {form.errors.name && <p className="form-error">{form.errors.name}</p>}
                    </div>

                    {/* Gender */}
                    <div className="form-group">
                      <label htmlFor="gender" className="form-label">Gender *</label>
                      <select
                        id="gender"
                        name="gender"
                        className={`input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10 ${
                          form.errors.gender ? 'input-error' : ''
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        }}
                        value={form.values.gender}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                      >
                        <option value="">Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {form.errors.gender && <p className="form-error">{form.errors.gender}</p>}
                    </div>

                    {/* Email ID */}
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email ID *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`input-field ${form.errors.email ? 'input-error' : ''}`}
                        value={form.values.email}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="yourname@domain.com"
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
                        className={`input-field ${form.errors.phone ? 'input-error' : ''}`}
                        value={form.values.phone}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="10-digit mobile number"
                      />
                      {form.errors.phone && <p className="form-error">{form.errors.phone}</p>}
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label htmlFor="category" className="form-label">Category *</label>
                      <select
                        id="category"
                        name="category"
                        className={`input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10 ${
                          form.errors.category ? 'input-error' : ''
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
                        <option value="">Select category</option>
                        {externalCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {form.errors.category && <p className="form-error">{form.errors.category}</p>}
                    </div>

                    {/* Organization */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="organization" className="form-label">Organization / Startup / Company Name *</label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        className={`input-field ${form.errors.organization ? 'input-error' : ''}`}
                        value={form.values.organization}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="Your organization name"
                      />
                      {form.errors.organization && <p className="form-error">{form.errors.organization}</p>}
                    </div>

                    {/* Address */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="address" className="form-label">Address *</label>
                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        className={`input-field ${form.errors.address ? 'input-error' : ''}`}
                        value={form.values.address}
                        onChange={handleInputChange}
                        onBlur={form.handleBlur}
                        required
                        disabled={loading}
                        placeholder="Your full address"
                      />
                      {form.errors.address && <p className="form-error">{form.errors.address}</p>}
                    </div>

                    {/* LinkedIn Profile */}
                    <div className="form-group md:col-span-2">
                      <label htmlFor="linkedin" className="form-label">LinkedIn Profile URL (Optional)</label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        className="input-field"
                        value={form.values.linkedin}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ACTION BUTTON */}
              <motion.div variants={itemVariants} className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isCheckingAvailability || loading}
                  className="btn-primary py-3 px-8 bg-ted-red text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingAvailability ? 'Checking...' : 'Next Step'}
                  {!isCheckingAvailability && <span>→</span>}
                </button>
              </motion.div>
            </>
          )}

          {/* STEP 1.5: VIRTUAL QUEUE WAITING ROOM */}
          {step === 1.5 && (
            <motion.div variants={itemVariants} className="card text-center p-12">
              <div className="w-24 h-24 bg-ted-red/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-ted-red/30 shadow-[0_0_30px_rgba(230,43,30,0.2)]">
                <span className="text-5xl animate-pulse">⏳</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">Virtual Queue</h3>
              <p className="text-gray-400 mb-8 text-lg">
                All seats are currently locked by other users making payments. You are in line.
              </p>
              <div className="inline-block bg-gray-900 border border-gray-700 rounded-xl px-12 py-6 mb-8 shadow-inner shadow-black/50">
                <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-3">Your Position</p>
                <p className="text-6xl font-bold text-ted-red">#{queuePosition}</p>
              </div>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed border-t border-gray-800 pt-6">
                Please <strong className="text-gray-300">do not close or refresh this tab</strong>. You will be automatically redirected to the payment page when it is your turn.
              </p>
            </motion.div>
          )}

          {/* STEP 2: PAYMENT VERIFICATION */}
          {step === 2 && (
            <motion.div variants={itemVariants} className="card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-2xl font-bold text-ted-red">Payment Verification</h3>
                <div className={`px-4 py-2 rounded-xl text-xl font-mono font-bold flex items-center gap-2 border transition-colors duration-500 ${isTimeLow ? 'bg-red-950/40 text-red-500 border-red-500/50' : 'bg-blue-950/40 text-blue-400 border-blue-500/50'}`}>
                  ⏳ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 mb-6">
                <p className="text-gray-300 mb-3 text-center">
                  Please scan the QR code to complete your payment. Submit the transaction details before the timer runs out!
                </p>
                <div className="text-center mb-6">
                  <span className="inline-block bg-ted-red/20 border border-ted-red/50 text-white px-6 py-2 rounded-xl font-bold text-xl shadow-[0_0_15px_rgba(230,43,30,0.3)]">
                    Registration Fee: ₹300
                  </span>
                </div>

                {/* QR Code with reducing border */}
                <div className="flex justify-center mb-10">
                  <div className={`relative w-64 h-64 flex items-center justify-center bg-white rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-shadow duration-500 ${isTimeLow ? 'shadow-red-900/20' : 'shadow-blue-900/20'}`}>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <rect x="2" y="2" width="96" height="96" rx="8" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                      <rect x="2" y="2" width="96" height="96" rx="8" fill="none" 
                            stroke={isTimeLow ? "#ef4444" : "#3b82f6"} 
                            strokeWidth="4"
                            pathLength="100"
                            strokeDasharray="100"
                            strokeDashoffset={100 - progressPercentage}
                            className="transition-all duration-1000 ease-linear" />
                    </svg>
                    <img src="/qr.png" alt="Payment QR Code" className="w-full h-full object-contain z-10 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transaction ID */}
                  <div className="form-group">
                    <label htmlFor="transactionId" className="form-label">Transaction ID / UTR *</label>
                    <input
                      type="text"
                      id="transactionId"
                      name="transactionId"
                      className={`input-field ${form.errors.transactionId ? 'input-error' : ''}`}
                      value={form.values.transactionId}
                      onChange={handleInputChange}
                      onBlur={form.handleBlur}
                      required
                      disabled={loading}
                      placeholder="e.g. 123456789012"
                    />
                    {form.errors.transactionId && <p className="form-error">{form.errors.transactionId}</p>}
                  </div>

                  {/* Payment Screenshot */}
                  <div className="form-group">
                    <label htmlFor="paymentScreenshot" className="form-label">Payment Screenshot * (Max 5MB)</label>
                    <input
                      type="file"
                      id="paymentScreenshot"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-950 file:text-red-300 hover:file:bg-red-900 ${
                        form.errors.paymentScreenshot ? 'input-error' : ''
                      }`}
                      disabled={loading}
                    />
                    {form.errors.paymentScreenshot && <p className="form-error">{form.errors.paymentScreenshot}</p>}
                    {form.values.paymentScreenshot && (
                      <div className="mt-4">
                        <p className="text-xs text-green-400 mb-2">Screenshot attached successfully</p>
                        <img
                          src={form.values.paymentScreenshot}
                          alt="Payment Preview"
                          className="h-32 object-contain rounded border border-gray-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Honeypot Field */}
              <input
                type="text"
                name="website"
                value={form.values.website}
                onChange={handleInputChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <div className="flex justify-between pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 px-8 bg-ted-red text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
      <Footer />
    </div>
  );
};

export default AttendeeApply;