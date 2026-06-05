import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useApi } from '../hooks/useApi';
import { speakerAPI, settingsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ==================== SPEAKER APPLICATION PORTAL ====================
const SpeakerApply = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, request, clearError } = useApi();
  const [speakerRegistrationOpen, setSpeakerRegistrationOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  // Section states
  const [validationError, setValidationError] = useState('');

  // Scroll to top on step changes or page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await settingsAPI.getSettings();
        setSpeakerRegistrationOpen(response.data.data.speakerRegistrationOpen ?? true);
      } catch (err) {
        console.error('Failed to fetch registration status', err);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const initialValues = {
    // --- SECTION 1: Speaker Profile ---
    name: '',
    selfNomination: 'Yes, I am nominating myself.',
    email: '',
    phone: '',
    profession: '',
    organization: '',
    location: '',
    linkedin: '',
    additionalLinks: '',
    
    // --- SECTION 1B: Nominator Information (Conditional) ---
    nominatorName: '',
    nominatorEmail: '',
    nominatorPhone: '',
    nominatorOrganization: '',
    nominatorRelationship: '',
    
    // --- IDEA 1 (Required) ---
    whySpeak1: '',
    idea1Title: '',
    idea1Description: '',
    idea1Domain: '',
    idea1WorthSpreading: '',
    idea1Relevance: '',
    idea1Challenge: '',
    idea1Impact: '',
    idea1Scalability: '',
    idea1LivedExperience: 'NO',
    idea1LivedExperienceDesc: '',
    idea1Props: 'NO',
    idea1PropsDetails: '',
    idea1Articles: '',
    idea1File: '', // Base64
    idea1FileName: '',
    idea1Comments: '',

    // --- SECTION 2: IDEA 2 (Optional) ---
    whySpeak2: '',
    idea2Title: '',
    idea2Description: '',
    idea2Domain: '',
    idea2WorthSpreading: '',
    idea2Relevance: '',
    idea2Challenge: '',
    idea2Impact: '',
    idea2Scalability: '',
    idea2LivedExperience: 'NO',
    idea2LivedExperienceDesc: '',
    idea2Props: 'NO',
    idea2PropsDetails: '',
    idea2Articles: '',
    idea2File: '', // Base64
    idea2FileName: '',
    idea2Comments: '',

    // --- SECTION 3: IDEA 3 (Optional) ---
    whySpeak3: '',
    idea3Title: '',
    idea3Description: '',
    idea3Domain: '',
    idea3WorthSpreading: '',
    idea3Relevance: '',
    idea3Challenge: '',
    idea3Impact: '',
    idea3Scalability: '',
    idea3LivedExperience: 'NO',
    idea3LivedExperienceDesc: '',
    idea3Props: 'NO',
    idea3PropsDetails: '',
    idea3Articles: '',
    idea3File: '', // Base64
    idea3FileName: '',
    idea3Comments: '',

    // --- SECTION 4: Proposed Talk & Confirmations ---
    proposedTitle: '',
    proposedDescription: '',
    proposedQualifications: '',
    policyComfort: 'Fully Comfortable',
    factCheckingNeed: 'No Significant Concerns',
    willingnessToModify: 'Fully Willing',
    soloPresentationConfirmed: false,
    durationConfirmed: false,
    compliesConfirmed: false,
    guidelinesAligned: 'YES',
    howLearned: '',

    website: '', // Honeypot
  };

  const handleFileChange = (e, fieldPrefix) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      form.setFieldError(`${fieldPrefix}File`, 'File size exceeds the 10 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setFieldValue(`${fieldPrefix}File`, reader.result);
      form.setFieldValue(`${fieldPrefix}FileName`, file.name);
      form.setFieldError(`${fieldPrefix}File`, '');
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (fieldPrefix) => {
    form.setFieldValue(`${fieldPrefix}File`, '');
    form.setFieldValue(`${fieldPrefix}FileName`, '');
  };

  // Client-side validations for each step
  const validateStep = (currentStepNum) => {
    const activeStepConfig = stepsList[currentStepNum - 1] || {};
    const stepKey = activeStepConfig.key;
    let isValid = true;
    form.setErrors({});

    if (stepKey === 'profile') {
      // Validate profile
      if (!form.values.name.trim() || form.values.name.trim().length < 2) {
        form.setFieldError('name', 'Full Name is required (min 2 characters)');
        isValid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.values.email)) {
        form.setFieldError('email', 'Valid email address is required');
        isValid = false;
      }
      if (!form.values.phone.trim()) {
        form.setFieldError('phone', 'Phone number is required');
        isValid = false;
      }
      if (!form.values.profession.trim()) {
        form.setFieldError('profession', 'Profession/Designation is required');
        isValid = false;
      }
      if (!form.values.organization.trim()) {
        form.setFieldError('organization', 'Organization/Company name is required');
        isValid = false;
      }
      if (!form.values.location.trim()) {
        form.setFieldError('location', 'Location (City, State, Country) is required');
        isValid = false;
      }
      const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;
      if (!linkedinRegex.test(form.values.linkedin)) {
        form.setFieldError('linkedin', 'Valid LinkedIn profile URL is required');
        isValid = false;
      }
    }

    if (stepKey === 'nominator') {
      // Validate nominator details
      if (!form.values.nominatorName.trim()) {
        form.setFieldError('nominatorName', 'Nominator Full Name is required');
        isValid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.values.nominatorEmail)) {
        form.setFieldError('nominatorEmail', 'Valid nominator email address is required');
        isValid = false;
      }
      if (!form.values.nominatorPhone.trim()) {
        form.setFieldError('nominatorPhone', 'Nominator phone number is required');
        isValid = false;
      }
      if (!form.values.nominatorOrganization.trim()) {
        form.setFieldError('nominatorOrganization', 'Nominator organization name is required');
        isValid = false;
      }
      if (!form.values.nominatorRelationship.trim()) {
        form.setFieldError('nominatorRelationship', 'Relationship with the speaker is required');
        isValid = false;
      }
    }

    if (stepKey === 'idea1') {
      if (!form.values.whySpeak1.trim()) {
        form.setFieldError('whySpeak1', 'Please explain why the speaker should speak');
        isValid = false;
      }
      if (!form.values.idea1Title.trim()) {
        form.setFieldError('idea1Title', 'Idea 1 Title is required');
        isValid = false;
      }
      if (form.values.idea1Description.trim().length < 10) {
        form.setFieldError('idea1Description', 'Description must be at least 10 characters');
        isValid = false;
      }
      if (!form.values.idea1Domain.trim()) {
        form.setFieldError('idea1Domain', 'Domain/Category is required');
        isValid = false;
      }
      if (!form.values.idea1WorthSpreading.trim()) {
        form.setFieldError('idea1WorthSpreading', 'Describe the Idea Worth Spreading');
        isValid = false;
      }
      if (!form.values.idea1Relevance.trim()) {
        form.setFieldError('idea1Relevance', 'Idea relevance is required');
        isValid = false;
      }
      if (!form.values.idea1Challenge.trim()) {
        form.setFieldError('idea1Challenge', 'Challenge/gap is required');
        isValid = false;
      }
      if (!form.values.idea1Impact.trim()) {
        form.setFieldError('idea1Impact', 'Measurable impact description is required');
        isValid = false;
      }
      if (!form.values.idea1Scalability.trim()) {
        form.setFieldError('idea1Scalability', 'Scalability description is required');
        isValid = false;
      }
      if (form.values.idea1LivedExperience === 'YES' && !form.values.idea1LivedExperienceDesc.trim()) {
        form.setFieldError('idea1LivedExperienceDesc', 'Please describe the lived experience');
        isValid = false;
      }
      if (form.values.idea1Props === 'YES' && !form.values.idea1PropsDetails.trim()) {
        form.setFieldError('idea1PropsDetails', 'Please describe the props/materials');
        isValid = false;
      }
      if (!form.values.idea1Articles.trim()) {
        form.setFieldError('idea1Articles', 'Relevant links, videos, or work samples are required');
        isValid = false;
      }
    }

    if (stepKey === 'idea2') {
      if (!form.values.whySpeak2.trim()) {
        form.setFieldError('whySpeak2', 'Please explain why the speaker should speak for this idea');
        isValid = false;
      }
      if (!form.values.idea2Title.trim()) {
        form.setFieldError('idea2Title', 'Idea 2 Title is required');
        isValid = false;
      }
      if (form.values.idea2Description.trim().length < 10) {
        form.setFieldError('idea2Description', 'Description must be at least 10 characters');
        isValid = false;
      }
      if (!form.values.idea2Domain.trim()) {
        form.setFieldError('idea2Domain', 'Domain/Category is required');
        isValid = false;
      }
      if (!form.values.idea2WorthSpreading.trim()) {
        form.setFieldError('idea2WorthSpreading', 'Describe the Idea Worth Spreading');
        isValid = false;
      }
      if (!form.values.idea2Relevance.trim()) {
        form.setFieldError('idea2Relevance', 'Idea relevance is required');
        isValid = false;
      }
      if (!form.values.idea2Challenge.trim()) {
        form.setFieldError('idea2Challenge', 'Challenge/gap is required');
        isValid = false;
      }
      if (!form.values.idea2Impact.trim()) {
        form.setFieldError('idea2Impact', 'Measurable impact description is required');
        isValid = false;
      }
      if (!form.values.idea2Scalability.trim()) {
        form.setFieldError('idea2Scalability', 'Scalability description is required');
        isValid = false;
      }
      if (form.values.idea2LivedExperience === 'YES' && !form.values.idea2LivedExperienceDesc.trim()) {
        form.setFieldError('idea2LivedExperienceDesc', 'Please describe the lived experience');
        isValid = false;
      }
      if (form.values.idea2Props === 'YES' && !form.values.idea2PropsDetails.trim()) {
        form.setFieldError('idea2PropsDetails', 'Please describe the props/materials');
        isValid = false;
      }
      if (!form.values.idea2Articles.trim()) {
        form.setFieldError('idea2Articles', 'Relevant links, videos, or work samples are required');
        isValid = false;
      }
    }

    if (stepKey === 'idea3') {
      if (!form.values.whySpeak3.trim()) {
        form.setFieldError('whySpeak3', 'Please explain why the speaker should speak for this idea');
        isValid = false;
      }
      if (!form.values.idea3Title.trim()) {
        form.setFieldError('idea3Title', 'Idea 3 Title is required');
        isValid = false;
      }
      if (form.values.idea3Description.trim().length < 10) {
        form.setFieldError('idea3Description', 'Description must be at least 10 characters');
        isValid = false;
      }
      if (!form.values.idea3Domain.trim()) {
        form.setFieldError('idea3Domain', 'Domain/Category is required');
        isValid = false;
      }
      if (!form.values.idea3WorthSpreading.trim()) {
        form.setFieldError('idea3WorthSpreading', 'Describe the Idea Worth Spreading');
        isValid = false;
      }
      if (!form.values.idea3Relevance.trim()) {
        form.setFieldError('idea3Relevance', 'Idea relevance is required');
        isValid = false;
      }
      if (!form.values.idea3Challenge.trim()) {
        form.setFieldError('idea3Challenge', 'Challenge/gap is required');
        isValid = false;
      }
      if (!form.values.idea3Impact.trim()) {
        form.setFieldError('idea3Impact', 'Measurable impact description is required');
        isValid = false;
      }
      if (!form.values.idea3Scalability.trim()) {
        form.setFieldError('idea3Scalability', 'Scalability description is required');
        isValid = false;
      }
      if (form.values.idea3LivedExperience === 'YES' && !form.values.idea3LivedExperienceDesc.trim()) {
        form.setFieldError('idea3LivedExperienceDesc', 'Please describe the lived experience');
        isValid = false;
      }
      if (form.values.idea3Props === 'YES' && !form.values.idea3PropsDetails.trim()) {
        form.setFieldError('idea3PropsDetails', 'Please describe the props/materials');
        isValid = false;
      }
      if (!form.values.idea3Articles.trim()) {
        form.setFieldError('idea3Articles', 'Relevant links, videos, or work samples are required');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setValidationError('');
      setStep((prev) => prev + 1);
    } else {
      setValidationError('Please fill out all required fields correctly before moving to the next section.');
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setValidationError('');
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (values) => {
    // Validate Step 4
    if (!values.proposedTitle.trim()) {
      form.setFieldError('proposedTitle', 'Proposed Talk Title is required');
      setValidationError('Proposed Talk Title is required.');
      window.scrollTo(0, 0);
      return;
    }
    if (!values.proposedDescription.trim()) {
      form.setFieldError('proposedDescription', 'Talk originality and sharing explanation is required');
      setValidationError('Talk description and explanation are required.');
      window.scrollTo(0, 0);
      return;
    }
    if (!values.proposedQualifications.trim()) {
      form.setFieldError('proposedQualifications', 'Qualifications highlight is required');
      setValidationError('Qualifications highlight is required.');
      window.scrollTo(0, 0);
      return;
    }
    if (!values.soloPresentationConfirmed) {
      form.setFieldError('soloPresentationConfirmed', 'You must confirm the presentation is solo');
      setValidationError('Please confirm that the presentation is solo.');
      window.scrollTo(0, 0);
      return;
    }
    if (!values.durationConfirmed) {
      form.setFieldError('durationConfirmed', 'You must confirm the talk does not exceed 18 minutes');
      setValidationError('Please confirm that the talk duration does not exceed 18 minutes.');
      window.scrollTo(0, 0);
      return;
    }
    if (!values.compliesConfirmed) {
      form.setFieldError('compliesConfirmed', 'You must confirm compliance with TEDx content guidelines');
      setValidationError('Please confirm compliance with TEDx content guidelines.');
      window.scrollTo(0, 0);
      return;
    }
    if (values.guidelinesAligned !== 'YES') {
      form.setFieldError('guidelinesAligned', 'You must confirm alignment with TEDx content guidelines');
      setValidationError('You must align with the TEDx content guidelines.');
      window.scrollTo(0, 0);
      return;
    }
    if (!values.howLearned.trim()) {
      form.setFieldError('howLearned', 'Information on how you learned about TEDxKARE is required');
      setValidationError('Please specify how you learned about TEDxKARE.');
      window.scrollTo(0, 0);
      return;
    }

    setValidationError('');

    const submitValues = { ...values };

    try {
      await request(() => speakerAPI.submitSpeaker(submitValues));
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/thank-you-speaker');
      }, 1500);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.details) {
        const fieldErrors = {};
        err.response.data.details.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        form.setErrors(fieldErrors);
        setValidationError('Some fields in your submission did not pass server validations.');
      } else {
        setValidationError(err.response?.data?.message || 'An error occurred during application submission.');
      }
      window.scrollTo(0, 0);
      console.error('Error submitting application:', err);
    }
  };

  const form = useForm(initialValues, onSubmit);

  const isSelfNominated = form.values.selfNomination === 'Yes, I am nominating myself.';
  
  const stepsList = isSelfNominated
    ? [
        { id: 1, label: '1. Profile', key: 'profile' },
        { id: 2, label: '2. Idea 1', key: 'idea1' },
        { id: 3, label: '3. Idea 2', key: 'idea2' },
        { id: 4, label: '4. Idea 3', key: 'idea3' },
        { id: 5, label: '5. Policy Checks', key: 'policy' }
      ]
    : [
        { id: 1, label: '1. Profile', key: 'profile' },
        { id: 2, label: '2. Nominator Info', key: 'nominator' },
        { id: 3, label: '3. Idea 1', key: 'idea1' },
        { id: 4, label: '4. Idea 2', key: 'idea2' },
        { id: 5, label: '5. Idea 3', key: 'idea3' },
        { id: 6, label: '6. Policy Checks', key: 'policy' }
      ];

  const currentStepKey = stepsList[step - 1]?.key || '';
  const totalSteps = stepsList.length;

  // Helper to dynamically style fields based on error state
  const getInputClassName = (fieldName, baseType = 'input') => {
    const hasError = !!form.errors[fieldName];
    const isTextarea = baseType === 'textarea';
    const isSelect = baseType === 'select';
    const pxClass = isSelect ? 'px-3' : 'px-4';
    const resizeClass = isTextarea ? 'resize-none' : '';
    const borderClass = hasError
      ? 'border-red-500/50 focus:border-red-500 shadow-sm shadow-red-950/20'
      : 'border-gray-800 focus:border-ted-red';
    return `w-full bg-black/60 border ${borderClass} rounded-xl ${pxClass} py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm ${resizeClass}`;
  };

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ted-red"></div>
      </div>
    );
  }

  if (!speakerRegistrationOpen) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16 relative overflow-hidden flex flex-col justify-between">
        <Navbar />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-ted-red/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="flex-1 flex items-center justify-center p-4 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl shadow-red-900/20"
          >
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⏳</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Applications Closed</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Thank you for your interest in presenting at <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span>. 
              The speaker application portal is currently closed for this cycle. Stay tuned to our community channels for future speaker opportunities!
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full btn-primary py-3 font-semibold rounded-xl"
            >
              Return to Home
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Decorative background ambient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 pt-10 pb-20 relative z-10">
        
        {/* Local Validation Error Banner */}
        {validationError && (
          <div className="mb-8 p-4 bg-red-950/45 border border-red-500/30 rounded-2xl text-red-200 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-sm">Validation Error</p>
                <p className="text-xs text-red-300 mt-0.5">{validationError}</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setValidationError('')} 
              className="text-red-400 hover:text-red-300 font-bold text-sm px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success / Error Alerts */}
        {submitSuccess && (
          <div className="mb-8 p-6 bg-green-950/30 border border-green-500/30 rounded-2xl text-green-300 text-center shadow-lg">
            <p className="font-semibold text-lg flex items-center justify-center gap-2">✓ Application submitted successfully!</p>
            <p className="text-xs text-green-400/80 mt-1">Redirecting to speaker thank-you page...</p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-300 flex justify-between items-center shadow-lg">
            <div>
              <p className="font-semibold text-sm">Submission Error</p>
              <p className="text-xs text-red-300 mt-0.5">{error}</p>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-300 font-bold text-sm px-2">✕</button>
          </div>
        )}

        {/* Header Title */}
        <div className="text-center mb-10 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-950/40 border border-red-500/30 text-ted-red">
            🎤 Speaker Nomination & Selection Form
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Apply to Speak at <span className="text-ted-red font-bold">TEDx</span><span className="font-light">KARE</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto font-light leading-relaxed">
            “Thank you for contributing to <span className="text-ted-red font-semibold">TEDx</span><span className="text-white font-light">KARE</span> Speaker Nominations. This form is designed to identify individuals with powerful ideas, inspiring experiences, and meaningful impact worth sharing on the <span className="text-ted-red font-semibold">TEDx</span><span className="text-white font-light">KARE</span> stage.”
          </p>
        </div>

        {/* Wizard Steps indicator */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 font-semibold mb-2 px-1">
            {stepsList.map((s) => (
              <span key={s.id} className={step === s.id ? "text-ted-red" : ""}>
                {s.label}
              </span>
            ))}
          </div>
          <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-ted-red transition-all duration-300 rounded-full" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={form.handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            
            {/* ==================== STEP 1: SPEAKER PROFILE ==================== */}
            {currentStepKey === 'profile' && (
              <motion.div
                key="step-profile"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold border-b border-gray-800 pb-3 text-ted-red flex items-center gap-2">
                  <span>👤</span> Section 1: Speaker Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Speaker’s Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.name}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.name && <p className="text-red-500 text-[10px]">{form.errors.name}</p>}
                  </div>

                  {/* Self Nomination */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Is this a self-nomination? *</label>
                    <select
                      name="selfNomination"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.selfNomination}
                      onChange={form.handleChange}
                      required
                    >
                      <option value="Yes, I am nominating myself.">Yes, I am nominating myself.</option>
                      <option value="No, I am nominating another individual.">No, I am nominating another individual.</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Speaker’s Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.email}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.email && <p className="text-red-500 text-[10px]">{form.errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Speaker’s Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="10-digit number"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.phone}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.phone && <p className="text-red-500 text-[10px]">{form.errors.phone}</p>}
                  </div>

                  {/* Profession */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Speaker’s Current Profession / Designation *</label>
                    <input
                      type="text"
                      name="profession"
                      placeholder="e.g. Researcher, Lead Designer"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.profession}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.profession && <p className="text-red-500 text-[10px]">{form.errors.profession}</p>}
                  </div>

                  {/* Organization */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Name of the Organization, Institution, or Company the Speaker is Currently Associated With *</label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="Name of association"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.organization}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.organization && <p className="text-red-500 text-[10px]">{form.errors.organization}</p>}
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Speaker’s Current Location (City, State, Country) *</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Chennai, Tamil Nadu, India"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.location}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.location && <p className="text-red-500 text-[10px]">{form.errors.location}</p>}
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Speaker’s LinkedIn Profile URL *</label>
                    <input
                      type="url"
                      name="linkedin"
                      placeholder="linkedin.com/in/username"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.linkedin}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.linkedin && <p className="text-red-500 text-[10px]">{form.errors.linkedin}</p>}
                  </div>
                </div>

                {/* Additional Links */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-bold">Additional Professional Links (Website / Portfolio / Social Media / Publications)</label>
                  <input
                    type="text"
                    name="additionalLinks"
                    placeholder="Enter links, comma-separated"
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                    value={form.values.additionalLinks}
                    onChange={form.handleChange}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-ted-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/20"
                  >
                    Next Section <span>→</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==================== STEP 2: NOMINATOR INFORMATION ==================== */}
            {currentStepKey === 'nominator' && (
              <motion.div
                key="step-nominator"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold border-b border-gray-800 pb-3 text-ted-red flex items-center gap-2">
                  <span>👤</span> Section 2: Nominator Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nominator Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Your Full Name *</label>
                    <input
                      type="text"
                      name="nominatorName"
                      placeholder="Enter your full name"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.nominatorName}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.nominatorName && <p className="text-red-500 text-[10px]">{form.errors.nominatorName}</p>}
                  </div>

                  {/* Nominator Email */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Your Email Address *</label>
                    <input
                      type="email"
                      name="nominatorEmail"
                      placeholder="yourname@example.com"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.nominatorEmail}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.nominatorEmail && <p className="text-red-500 text-[10px]">{form.errors.nominatorEmail}</p>}
                  </div>

                  {/* Nominator Phone */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Your Phone Number *</label>
                    <input
                      type="text"
                      name="nominatorPhone"
                      placeholder="10-digit number"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.nominatorPhone}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.nominatorPhone && <p className="text-red-500 text-[10px]">{form.errors.nominatorPhone}</p>}
                  </div>

                  {/* Nominator Organization */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Name of Your Organization *</label>
                    <input
                      type="text"
                      name="nominatorOrganization"
                      placeholder="Name of association"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.nominatorOrganization}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.nominatorOrganization && <p className="text-red-500 text-[10px]">{form.errors.nominatorOrganization}</p>}
                  </div>
                </div>

                {/* Nominator Relationship */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-bold">What is your relationship with the Speaker? *</label>
                  <input
                    type="text"
                    name="nominatorRelationship"
                    placeholder="e.g. Colleague, Professor, Friend"
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                    value={form.values.nominatorRelationship}
                    onChange={form.handleChange}
                    required
                  />
                  {form.errors.nominatorRelationship && <p className="text-red-500 text-[10px]">{form.errors.nominatorRelationship}</p>}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>←</span> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-ted-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/20"
                  >
                    Next Section <span>→</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==================== STEP: IDEA 1 ==================== */}
            {currentStepKey === 'idea1' && (
              <motion.div
                key="step-idea1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold border-b border-gray-800 pb-3 text-ted-red flex items-center justify-between">
                  <span className="flex items-center gap-2"><span>💡</span> Section 2: First Idea Evaluation</span>
                </h2>

                <div className="space-y-5">
                  {/* Why believe should speak */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Why do you believe this Speaker should speak at <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span>? *</label>
                    <textarea
                      name="whySpeak1"
                      placeholder="Describe their speaking capabilities, unique background, and core alignment..."
                      rows="3"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.whySpeak1}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.whySpeak1 && <p className="text-red-500 text-[10px]">{form.errors.whySpeak1}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Idea 1 Title */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">IDEA 1 – TITLE *</label>
                      <input
                        type="text"
                        name="idea1Title"
                        placeholder="Enter Idea 1 Title"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.idea1Title}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea1Title && <p className="text-red-500 text-[10px]">{form.errors.idea1Title}</p>}
                    </div>

                    {/* Idea 1 Domain */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">DOMAIN - IDEA 1 *</label>
                      <input
                        type="text"
                        name="idea1Domain"
                        placeholder="e.g. Science, Technology, Business"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.idea1Domain}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea1Domain && <p className="text-red-500 text-[10px]">{form.errors.idea1Domain}</p>}
                    </div>
                  </div>

                  {/* Idea 1 Description */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">DESCRIPTION - IDEA 1 *</label>
                    <textarea
                      name="idea1Description"
                      placeholder="Provide a detailed description of this talk idea..."
                      rows="3"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.idea1Description}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.idea1Description && <p className="text-red-500 text-[10px]">{form.errors.idea1Description}</p>}
                  </div>

                  {/* Worth Spreading */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Describe the Speaker’s “Idea Worth Spreading.” *</label>
                    <textarea
                      name="idea1WorthSpreading"
                      placeholder="What is the core message of this talk concept?"
                      rows="3"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.idea1WorthSpreading}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.idea1WorthSpreading && <p className="text-red-500 text-[10px]">{form.errors.idea1WorthSpreading}</p>}
                  </div>

                  {/* Relevance */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Why is this idea relevant in today’s world? *</label>
                    <textarea
                      name="idea1Relevance"
                      placeholder="Explain the modern relevance, context, or urgency..."
                      rows="2.5"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.idea1Relevance}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.idea1Relevance && <p className="text-red-500 text-[10px]">{form.errors.idea1Relevance}</p>}
                  </div>

                  {/* Challenge */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">What challenge, issue, or gap does this idea aim to address? *</label>
                    <textarea
                      name="idea1Challenge"
                      placeholder="What problem does it tackle?"
                      rows="2.5"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.idea1Challenge}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.idea1Challenge && <p className="text-red-500 text-[10px]">{form.errors.idea1Challenge}</p>}
                  </div>

                  {/* Impact */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">How has the Speaker created measurable, visible, or meaningful impact through their work or idea? *</label>
                    <textarea
                      name="idea1Impact"
                      placeholder="Provide data, metrics, or examples of real-world results..."
                      rows="2.5"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.idea1Impact}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.idea1Impact && <p className="text-red-500 text-[10px]">{form.errors.idea1Impact}</p>}
                  </div>

                  {/* Scalability */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Is the Speaker's idea scalable, adaptable, or replicable beyond their community or field? Please explain. *</label>
                    <textarea
                      name="idea1Scalability"
                      placeholder="Describe the adaptability of the talk concept..."
                      rows="2.5"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.idea1Scalability}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.idea1Scalability && <p className="text-red-500 text-[10px]">{form.errors.idea1Scalability}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Lived Experience */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Does the Speaker have personal or lived experience connected to this idea? *</label>
                      <select
                        name="idea1LivedExperience"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.idea1LivedExperience}
                        onChange={form.handleChange}
                        required
                      >
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                      </select>
                    </div>

                    {/* Props */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Will the speaker be using any props, demonstrations, or physical materials during the TEDx talk? *</label>
                      <select
                        name="idea1Props"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.idea1Props}
                        onChange={form.handleChange}
                        required
                      >
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                      </select>
                    </div>
                  </div>

                  {/* Lived Experience Details */}
                  {form.values.idea1LivedExperience === 'YES' && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">If yes, please briefly describe the lived experience and how it connects to the idea. *</label>
                      <textarea
                        name="idea1LivedExperienceDesc"
                        placeholder="Detail the connection..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea1LivedExperienceDesc}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea1LivedExperienceDesc && <p className="text-red-500 text-[10px]">{form.errors.idea1LivedExperienceDesc}</p>}
                    </div>
                  )}

                  {/* Props Details */}
                  {form.values.idea1Props === 'YES' && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">If Yes, Please provide details of the props, equipment, or materials the speaker plans to use. *</label>
                      <textarea
                        name="idea1PropsDetails"
                        placeholder="Detail the props/materials..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea1PropsDetails}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea1PropsDetails && <p className="text-red-500 text-[10px]">{form.errors.idea1PropsDetails}</p>}
                    </div>
                  )}

                  {/* Articles / work samples */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Please share relevant articles, videos, interviews, podcasts, achievements, or work samples related to the Speaker. *</label>
                    <textarea
                      name="idea1Articles"
                      placeholder="Comma-separated URLs or text details..."
                      rows="2.5"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.idea1Articles}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.idea1Articles && <p className="text-red-500 text-[10px]">{form.errors.idea1Articles}</p>}
                  </div>

                  {/* Document upload */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-300 font-bold block">Please upload any supporting documents or media related to the Speaker, If any</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                        Choose Document
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'idea1')}
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        />
                      </label>
                      {form.values.idea1FileName ? (
                        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                          <span className="text-[10px] text-gray-300 truncate max-w-xs">{form.values.idea1FileName}</span>
                          <button
                            type="button"
                            onClick={() => clearFile('idea1')}
                            className="text-red-500 hover:text-red-400 font-bold text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500">No file uploaded. Max size 10 MB.</span>
                      )}
                    </div>
                    {form.errors.idea1File && <p className="text-red-500 text-[10px]">{form.errors.idea1File}</p>}
                  </div>

                  {/* Comments */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Any additional comments, recommendations, or notes for the <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span> Selection Committee?</label>
                    <textarea
                      name="idea1Comments"
                      placeholder="Add any extra comments here..."
                      rows="2"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.idea1Comments}
                      onChange={form.handleChange}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>←</span> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-ted-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/20"
                  >
                    Next Section <span>→</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==================== STEP 2: IDEA 2 (OPTIONAL) ==================== */}
            {currentStepKey === 'idea2' && (
              <motion.div
                key="step-idea2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold border-b border-gray-800 pb-3 text-ted-red flex items-center justify-between">
                  <span className="flex items-center gap-2"><span>💡</span> Section 2: Second Idea Evaluation</span>
                </h2>

                <div className="space-y-5">
                    {/* Why believe should speak for Idea 2 */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Why do you believe this Speaker should speak at <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span>? *</label>
                      <textarea
                        name="whySpeak2"
                        placeholder="Describe their alignment regarding this specific second idea..."
                        rows="3"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.whySpeak2}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.whySpeak2 && <p className="text-red-500 text-[10px]">{form.errors.whySpeak2}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Idea 2 Title */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">IDEA 2 – TITLE *</label>
                        <input
                          type="text"
                          name="idea2Title"
                          placeholder="Enter Idea 2 Title"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                          value={form.values.idea2Title}
                          onChange={form.handleChange}
                          required
                        />
                        {form.errors.idea2Title && <p className="text-red-500 text-[10px]">{form.errors.idea2Title}</p>}
                      </div>

                      {/* Idea 2 Domain */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">DOMAIN - IDEA 2 *</label>
                        <input
                          type="text"
                          name="idea2Domain"
                          placeholder="e.g. Science, Technology, Business"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                          value={form.values.idea2Domain}
                          onChange={form.handleChange}
                          required
                        />
                        {form.errors.idea2Domain && <p className="text-red-500 text-[10px]">{form.errors.idea2Domain}</p>}
                      </div>
                    </div>

                    {/* Idea 2 Description */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">DESCRIPTION - IDEA 2 *</label>
                      <textarea
                        name="idea2Description"
                        placeholder="Provide a detailed description of this second talk idea..."
                        rows="3"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea2Description}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea2Description && <p className="text-red-500 text-[10px]">{form.errors.idea2Description}</p>}
                    </div>

                    {/* Worth Spreading */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Describe the Speaker’s “Idea Worth Spreading.” *</label>
                      <textarea
                        name="idea2WorthSpreading"
                        placeholder="What is the core message of this second talk concept?"
                        rows="3"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea2WorthSpreading}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea2WorthSpreading && <p className="text-red-500 text-[10px]">{form.errors.idea2WorthSpreading}</p>}
                    </div>

                    {/* Relevance */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Why is this idea relevant in today’s world? *</label>
                      <textarea
                        name="idea2Relevance"
                        placeholder="Explain why this second topic is relevant today..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea2Relevance}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea2Relevance && <p className="text-red-500 text-[10px]">{form.errors.idea2Relevance}</p>}
                    </div>

                    {/* Challenge */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">What challenge, issue, or gap does this idea aim to address? *</label>
                      <textarea
                        name="idea2Challenge"
                        placeholder="What problem does it tackle?"
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea2Challenge}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea2Challenge && <p className="text-red-500 text-[10px]">{form.errors.idea2Challenge}</p>}
                    </div>

                    {/* Impact */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">How has the Speaker created measurable, visible, or meaningful impact through their work or idea? *</label>
                      <textarea
                        name="idea2Impact"
                        placeholder="Describe results and metrics..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea2Impact}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea2Impact && <p className="text-red-500 text-[10px]">{form.errors.idea2Impact}</p>}
                    </div>

                    {/* Scalability */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Is the Speaker’s idea scalable, adaptable, or replicable beyond their community or field? Please explain. *</label>
                      <textarea
                        name="idea2Scalability"
                        placeholder="Explain the scalability..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea2Scalability}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea2Scalability && <p className="text-red-500 text-[10px]">{form.errors.idea2Scalability}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Lived Experience */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">Does the Speaker have personal or lived experience connected to this idea? *</label>
                        <select
                          name="idea2LivedExperience"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                          value={form.values.idea2LivedExperience}
                          onChange={form.handleChange}
                          required
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      {/* Props */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">Will the speaker be using any props, demonstrations, or physical materials during the TEDx talk? *</label>
                        <select
                          name="idea2Props"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                          value={form.values.idea2Props}
                          onChange={form.handleChange}
                          required
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>
                    </div>

                    {/* Lived Experience Details */}
                    {form.values.idea2LivedExperience === 'YES' && (
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">If yes, please briefly describe the lived experience and how it connects to the idea. *</label>
                        <textarea
                          name="idea2LivedExperienceDesc"
                          placeholder="Detail the connection..."
                          rows="2.5"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                          value={form.values.idea2LivedExperienceDesc}
                          onChange={form.handleChange}
                          required
                        />
                        {form.errors.idea2LivedExperienceDesc && <p className="text-red-500 text-[10px]">{form.errors.idea2LivedExperienceDesc}</p>}
                      </div>
                    )}

                    {/* Props Details */}
                    {form.values.idea2Props === 'YES' && (
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">If Yes, Please provide details of the props, equipment, or materials the speaker plans to use. *</label>
                        <textarea
                          name="idea2PropsDetails"
                          placeholder="Detail the props/materials..."
                          rows="2.5"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                          value={form.values.idea2PropsDetails}
                          onChange={form.handleChange}
                          required
                        />
                        {form.errors.idea2PropsDetails && <p className="text-red-500 text-[10px]">{form.errors.idea2PropsDetails}</p>}
                      </div>
                    )}

                    {/* Articles / work samples */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Please share relevant articles, videos, interviews, podcasts, achievements, or work samples related to the Speaker . *</label>
                      <textarea
                        name="idea2Articles"
                        placeholder="Comma-separated URLs or text details..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea2Articles}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea2Articles && <p className="text-red-500 text-[10px]">{form.errors.idea2Articles}</p>}
                    </div>

                    {/* Document upload */}
                    <div className="space-y-2">
                      <label className="text-xs text-gray-300 font-bold block">Please upload any supporting documents or media related to the Speaker, If any</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                          Choose Document
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'idea2')}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                        </label>
                        {form.values.idea2FileName ? (
                          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                            <span className="text-[10px] text-gray-300 truncate max-w-xs">{form.values.idea2FileName}</span>
                            <button
                              type="button"
                              onClick={() => clearFile('idea2')}
                              className="text-red-500 hover:text-red-400 font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500">No file uploaded. Max size 10 MB.</span>
                        )}
                      </div>
                      {form.errors.idea2File && <p className="text-red-500 text-[10px]">{form.errors.idea2File}</p>}
                    </div>

                    {/* Comments */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Any additional comments, recommendations, or notes for the <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span> Selection Committee?</label>
                      <textarea
                        name="idea2Comments"
                        placeholder="Add any extra comments here..."
                        rows="2"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea2Comments}
                        onChange={form.handleChange}
                      />
                    </div>
                  </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>←</span> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-ted-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/20"
                  >
                    Next Section <span>→</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==================== STEP 3: IDEA 3 (OPTIONAL) ==================== */}
            {currentStepKey === 'idea3' && (
              <motion.div
                key="step-idea3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold border-b border-gray-800 pb-3 text-ted-red flex items-center justify-between">
                  <span className="flex items-center gap-2"><span>💡</span> Section 3: Third Idea Evaluation</span>
                </h2>

                <div className="space-y-5">
                    {/* Why believe should speak for Idea 3 */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Why do you believe this Speaker should speak at <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span>? *</label>
                      <textarea
                        name="whySpeak3"
                        placeholder="Describe their alignment regarding this specific third idea..."
                        rows="3"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.whySpeak3}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.whySpeak3 && <p className="text-red-500 text-[10px]">{form.errors.whySpeak3}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Idea 3 Title */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">IDEA 3 – TITLE *</label>
                        <input
                          type="text"
                          name="idea3Title"
                          placeholder="Enter Idea 3 Title"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                          value={form.values.idea3Title}
                          onChange={form.handleChange}
                          required
                        />
                        {form.errors.idea3Title && <p className="text-red-500 text-[10px]">{form.errors.idea3Title}</p>}
                      </div>

                      {/* Idea 3 Domain */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">DOMAIN - IDEA 3 *</label>
                        <input
                          type="text"
                          name="idea3Domain"
                          placeholder="e.g. Science, Technology, Business"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                          value={form.values.idea3Domain}
                          onChange={form.handleChange}
                          required
                        />
                        {form.errors.idea3Domain && <p className="text-red-500 text-[10px]">{form.errors.idea3Domain}</p>}
                      </div>
                    </div>

                    {/* Idea 3 Description */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">DESCRIPTION - IDEA 3 *</label>
                      <textarea
                        name="idea3Description"
                        placeholder="Provide a detailed description of this third talk idea..."
                        rows="3"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea3Description}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea3Description && <p className="text-red-500 text-[10px]">{form.errors.idea3Description}</p>}
                    </div>

                    {/* Worth Spreading */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Describe the Speaker's “Idea Worth Spreading.” *</label>
                      <textarea
                        name="idea3WorthSpreading"
                        placeholder="What is the core message of this third talk concept?"
                        rows="3"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea3WorthSpreading}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea3WorthSpreading && <p className="text-red-500 text-[10px]">{form.errors.idea3WorthSpreading}</p>}
                    </div>

                    {/* Relevance */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Why is this idea relevant in today’s world? *</label>
                      <textarea
                        name="idea3Relevance"
                        placeholder="Explain why this third topic is relevant today..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea3Relevance}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea3Relevance && <p className="text-red-500 text-[10px]">{form.errors.idea3Relevance}</p>}
                    </div>

                    {/* Challenge */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">What challenge, issue, or gap does this idea aim to address? *</label>
                      <textarea
                        name="idea3Challenge"
                        placeholder="What problem does it tackle?"
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea3Challenge}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea3Challenge && <p className="text-red-500 text-[10px]">{form.errors.idea3Challenge}</p>}
                    </div>

                    {/* Impact */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">How has the Speaker created measurable, visible, or meaningful impact through their work or idea? *</label>
                      <textarea
                        name="idea3Impact"
                        placeholder="Describe results and metrics..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea3Impact}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea3Impact && <p className="text-red-500 text-[10px]">{form.errors.idea3Impact}</p>}
                    </div>

                    {/* Scalability */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Is the Speaker’s idea scalable, adaptable, or replicable beyond their community or field? Please explain. *</label>
                      <textarea
                        name="idea3Scalability"
                        placeholder="Explain the scalability..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea3Scalability}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea3Scalability && <p className="text-red-500 text-[10px]">{form.errors.idea3Scalability}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Lived Experience */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">Does the Speaker have personal or lived experience connected to this idea? *</label>
                        <select
                          name="idea3LivedExperience"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                          value={form.values.idea3LivedExperience}
                          onChange={form.handleChange}
                          required
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>

                      {/* Props */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">Will the speaker be using any props, demonstrations, or physical materials during the TEDx talk? *</label>
                        <select
                          name="idea3Props"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                          value={form.values.idea3Props}
                          onChange={form.handleChange}
                          required
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                        </select>
                      </div>
                    </div>

                    {/* Lived Experience Details */}
                    {form.values.idea3LivedExperience === 'YES' && (
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">If yes, please briefly describe the lived experience and how it connects to the idea. *</label>
                        <textarea
                          name="idea3LivedExperienceDesc"
                          placeholder="Detail the connection..."
                          rows="2.5"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                          value={form.values.idea3LivedExperienceDesc}
                          onChange={form.handleChange}
                          required
                        />
                        {form.errors.idea3LivedExperienceDesc && <p className="text-red-500 text-[10px]">{form.errors.idea3LivedExperienceDesc}</p>}
                      </div>
                    )}

                    {/* Props Details */}
                    {form.values.idea3Props === 'YES' && (
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-bold">If Yes, Please provide details of the props, equipment, or materials the speaker plans to use. *</label>
                        <textarea
                          name="idea3PropsDetails"
                          placeholder="Detail the props/materials..."
                          rows="2.5"
                          className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                          value={form.values.idea3PropsDetails}
                          onChange={form.handleChange}
                          required
                        />
                        {form.errors.idea3PropsDetails && <p className="text-red-500 text-[10px]">{form.errors.idea3PropsDetails}</p>}
                      </div>
                    )}

                    {/* Articles / work samples */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Please share relevant articles, videos, interviews, podcasts, achievements, or work samples related to the Speaker. *</label>
                      <textarea
                        name="idea3Articles"
                        placeholder="Comma-separated URLs or text details..."
                        rows="2.5"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea3Articles}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.idea3Articles && <p className="text-red-500 text-[10px]">{form.errors.idea3Articles}</p>}
                    </div>

                    {/* Document upload */}
                    <div className="space-y-2">
                      <label className="text-xs text-gray-300 font-bold block">Please upload any supporting documents or media related to the Speaker ,If any</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                          Choose Document
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'idea3')}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          />
                        </label>
                        {form.values.idea3FileName ? (
                          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                            <span className="text-[10px] text-gray-300 truncate max-w-xs">{form.values.idea3FileName}</span>
                            <button
                              type="button"
                              onClick={() => clearFile('idea3')}
                              className="text-red-500 hover:text-red-400 font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500">No file uploaded. Max size 10 MB.</span>
                        )}
                      </div>
                      {form.errors.idea3File && <p className="text-red-500 text-[10px]">{form.errors.idea3File}</p>}
                    </div>

                    {/* Comments */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold">Any additional comments, recommendations, or notes for the <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span> Selection Committee?</label>
                      <textarea
                        name="idea3Comments"
                        placeholder="Add any extra comments here..."
                        rows="2"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                        value={form.values.idea3Comments}
                        onChange={form.handleChange}
                      />
                    </div>
                  </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>←</span> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-ted-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/20"
                  >
                    Next Section <span>→</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ==================== STEP 4: PROPOSED TALK & CONFIRMATIONS ==================== */}
            {currentStepKey === 'policy' && (
              <motion.div
                key="step-policy"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold border-b border-gray-800 pb-3 text-ted-red flex items-center gap-2">
                  <span>📝</span> Section 4: Talk Details & Policy Confirmations
                </h2>

                <div className="space-y-5">
                  {/* Proposed Talk Title */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold block">Proposed Talk Title *</label>
                    <input
                      type="text"
                      name="proposedTitle"
                      placeholder="Enter Proposed Talk Title"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.proposedTitle}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.proposedTitle && <p className="text-red-500 text-[10px]">{form.errors.proposedTitle}</p>}
                  </div>

                  {/* Describe originality/relevance */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold block">Describe the speaker’s idea and explain why it is original, relevant, and worth sharing. Include any evidence, research, expertise, or experience that supports the idea *</label>
                    <textarea
                      name="proposedDescription"
                      placeholder="Provide detailed evidence, originality claims, and core value points..."
                      rows="3"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.proposedDescription}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.proposedDescription && <p className="text-red-500 text-[10px]">{form.errors.proposedDescription}</p>}
                  </div>

                  {/* Qualifications */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold block">Why is the speaker qualified to deliver this talk? Please highlight the speaker’s experience, expertise, achievements, or speaking background related to the topic. *</label>
                    <textarea
                      name="proposedQualifications"
                      placeholder="List speaking experience, degrees, awards, or subject matter expert credentials..."
                      rows="3"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.proposedQualifications}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.proposedQualifications && <p className="text-red-500 text-[10px]">{form.errors.proposedQualifications}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Policy Comfort */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold block">Is the Speaker comfortable with TEDx recording, publishing, and distribution? *</label>
                      <select
                        name="policyComfort"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.policyComfort}
                        onChange={form.handleChange}
                        required
                      >
                        <option value="Fully Comfortable">Fully Comfortable</option>
                        <option value="Comfortable with Minor Concerns">Comfortable with Minor Concerns</option>
                        <option value="Unsure">Unsure</option>
                        <option value="Not Comfortable">Not Comfortable</option>
                      </select>
                    </div>

                    {/* Fact-Checking */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold block">Could this topic require additional fact-checking or involve sensitive content? *</label>
                      <select
                        name="factCheckingNeed"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.factCheckingNeed}
                        onChange={form.handleChange}
                        required
                      >
                        <option value="No Significant Concerns">No Significant Concerns</option>
                        <option value="Minor Fact-Checking Required">Minor Fact-Checking Required</option>
                        <option value="Potentially Sensitive or Controversial">Potentially Sensitive or Controversial</option>
                        <option value="Highly Controversial Topic">Highly Controversial Topic</option>
                      </select>
                    </div>

                    {/* Content Willingness */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold block">Is Speaker willing to modify talk if requested to align with TEDx guidelines? *</label>
                      <select
                        name="willingnessToModify"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.willingnessToModify}
                        onChange={form.handleChange}
                        required
                      >
                        <option value="Fully Willing">Fully Willing</option>
                        <option value="Willing After Discussion">Willing After Discussion</option>
                        <option value="Unsure">Unsure</option>
                        <option value="Unwilling">Unwilling</option>
                      </select>
                    </div>
                  </div>

                  {/* Prohibited Content & Guidelines Alignment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-300 font-bold block">Confirm proposed talk aligns with guidelines and does not include prohibited content (politics, religious proselytizing, pseudoscience, sales pitches) *</label>
                      <select
                        name="guidelinesAligned"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.guidelinesAligned}
                        onChange={form.handleChange}
                        required
                      >
                        <option value="YES">YES</option>
                        <option value="No">No</option>
                      </select>
                      {form.errors.guidelinesAligned && <p className="text-red-500 text-[10px]">{form.errors.guidelinesAligned}</p>}
                    </div>

                    {/* How Learned */}
                    <div className="space-y-1">
                       <label className="text-xs text-gray-300 font-light block">How did you learn about <span className="text-ted-red font-bold">TEDx</span><span className="text-gray-300 font-light">KARE</span>? *</label>
                      <input
                        type="text"
                        name="howLearned"
                        placeholder="e.g. Social media, email, friend, website"
                        className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                        value={form.values.howLearned}
                        onChange={form.handleChange}
                        required
                      />
                      {form.errors.howLearned && <p className="text-red-500 text-[10px]">{form.errors.howLearned}</p>}
                    </div>
                  </div>

                  {/* Confirmation Checklist boxes */}
                  <div className="bg-black/40 border border-gray-800 rounded-xl p-5 space-y-3.5 mt-3">
                    <span className="text-xs text-ted-red font-bold uppercase tracking-wider block">Please confirm the following rules:</span>

                    {/* Solo presentation */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="soloPresentationConfirmed"
                        checked={form.values.soloPresentationConfirmed}
                        onChange={form.handleChange}
                        className="mt-1 rounded accent-ted-red"
                        required
                      />
                      <span className="text-xs text-gray-300 leading-normal">
                        Will be delivered as a solo presentation *
                      </span>
                    </label>
                    {form.errors.soloPresentationConfirmed && <p className="text-red-500 text-[10px]">{form.errors.soloPresentationConfirmed}</p>}

                    {/* Max 18 mins */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="durationConfirmed"
                        checked={form.values.durationConfirmed}
                        onChange={form.handleChange}
                        className="mt-1 rounded accent-ted-red"
                        required
                      />
                      <span className="text-xs text-gray-300 leading-normal">
                        Will not exceed 18 minutes *
                      </span>
                    </label>
                    {form.errors.durationConfirmed && <p className="text-red-500 text-[10px]">{form.errors.durationConfirmed}</p>}

                    {/* Complies with guidelines */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="compliesConfirmed"
                        checked={form.values.compliesConfirmed}
                        onChange={form.handleChange}
                        className="mt-1 rounded accent-ted-red"
                        required
                      />
                      <span className="text-xs text-gray-300 leading-normal">
                        Complies with TEDx content guidelines *
                      </span>
                    </label>
                    {form.errors.compliesConfirmed && <p className="text-red-500 text-[10px]">{form.errors.compliesConfirmed}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    disabled={loading || submitSuccess}
                  >
                    <span>←</span> Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-ted-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/20"
                    disabled={loading || submitSuccess}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      <>Submit Application <span>✓</span></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>

      </main>

      <Footer />
    </div>
  );
};

export default SpeakerApply;
