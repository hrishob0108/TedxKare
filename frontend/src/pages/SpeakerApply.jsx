import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useApi, useLocalStorage } from '../hooks/useApi';
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
      let attempts = 3;
      while (attempts > 0) {
        try {
          // Use a shorter 4-second timeout to handle cold start retries quickly
          const response = await settingsAPI.getSettings({ timeout: 4000 });
          setSpeakerRegistrationOpen(response.data.data.speakerRegistrationOpen ?? true);
          setIsCheckingStatus(false);
          return;
        } catch (err) {
          attempts--;
          console.error(`Failed to fetch registration status. Remaining attempts: ${attempts}`, err);
          if (attempts > 0) {
            // Wait 2.5 seconds before retrying to give the backend server time to spin up
            await new Promise((resolve) => setTimeout(resolve, 2500));
          }
        }
      }
      setSpeakerRegistrationOpen(false);
      setIsCheckingStatus(false);
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
    firstTedxTalk: 'YES',
    hasDisability: 'NO',
    disabilityDetails: '',
    
    // --- SECTION 1B: Nominator Information (Conditional) ---
    nominatorName: '',
    nominatorEmail: '',
    nominatorPhone: '',
    nominatorLocation: '',
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
    idea1ImpactFile: '',
    idea1ImpactFileName: '',
    idea1Evidence: '',
    idea1EvidenceFile: '',
    idea1EvidenceFileName: '',
    idea1Scalability: '',
    idea1LivedExperience: 'NO',
    idea1LivedExperienceDesc: '',
    idea1Props: 'NO',
    idea1PropsDetails: '',
    idea1PresentedBefore: 'NO',
    idea1PresentedBeforeDetails: '',
    idea1PresentedBeforeFile: '',
    idea1PresentedBeforeFileName: '',
    idea1Articles: '',
    idea1File: '', // Base64
    idea1FileName: '',
    idea1NewSurprising: '',
    idea1Audience: '',
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
    idea2ImpactFile: '',
    idea2ImpactFileName: '',
    idea2Evidence: '',
    idea2EvidenceFile: '',
    idea2EvidenceFileName: '',
    idea2Scalability: '',
    idea2LivedExperience: 'NO',
    idea2LivedExperienceDesc: '',
    idea2Props: 'NO',
    idea2PropsDetails: '',
    idea2PresentedBefore: 'NO',
    idea2PresentedBeforeDetails: '',
    idea2PresentedBeforeFile: '',
    idea2PresentedBeforeFileName: '',
    idea2Articles: '',
    idea2File: '', // Base64
    idea2FileName: '',
    idea2NewSurprising: '',
    idea2Audience: '',
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
    idea3ImpactFile: '',
    idea3ImpactFileName: '',
    idea3Evidence: '',
    idea3EvidenceFile: '',
    idea3EvidenceFileName: '',
    idea3Scalability: '',
    idea3LivedExperience: 'NO',
    idea3LivedExperienceDesc: '',
    idea3Props: 'NO',
    idea3PropsDetails: '',
    idea3PresentedBefore: 'NO',
    idea3PresentedBeforeDetails: '',
    idea3PresentedBeforeFile: '',
    idea3PresentedBeforeFileName: '',
    idea3Articles: '',
    idea3File: '', // Base64
    idea3FileName: '',
    idea3NewSurprising: '',
    idea3Audience: '',
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
    hasAdditionalIdeas: 'YES',
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
      if (!form.values.whySpeak1.trim()) {
        form.setFieldError('whySpeak1', 'Please explain why the speaker should speak');
        isValid = false;
      }
      if (!form.values.firstTedxTalk) {
        form.setFieldError('firstTedxTalk', 'Specify if this will be the speaker\'s first TEDx talk');
        isValid = false;
      }
      if (!form.values.hasDisability) {
        form.setFieldError('hasDisability', 'Please select if the speaker has any disability');
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
      if (!form.values.nominatorLocation.trim()) {
        form.setFieldError('nominatorLocation', 'Nominator location is required');
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
      if (!form.values.idea1Evidence.trim()) {
        form.setFieldError('idea1Evidence', 'Evidence/research supporting claims is required');
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
      if (form.values.idea1PresentedBefore === 'YES' && !form.values.idea1PresentedBeforeDetails.trim()) {
        form.setFieldError('idea1PresentedBeforeDetails', 'Please describe where this has been shared');
        isValid = false;
      }
      if (!form.values.idea1Articles.trim()) {
        form.setFieldError('idea1Articles', 'Relevant links, videos, or work samples are required');
        isValid = false;
      }
      if (!form.values.idea1NewSurprising.trim()) {
        form.setFieldError('idea1NewSurprising', 'Explain what makes this idea new/surprising');
        isValid = false;
      }
      if (!form.values.idea1Audience.trim()) {
        form.setFieldError('idea1Audience', 'Explain who would benefit most');
        isValid = false;
      }
    }

    if (stepKey === 'idea2') {
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
      if (!form.values.idea2Evidence.trim()) {
        form.setFieldError('idea2Evidence', 'Evidence/research supporting claims is required');
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
      if (form.values.idea2PresentedBefore === 'YES' && !form.values.idea2PresentedBeforeDetails.trim()) {
        form.setFieldError('idea2PresentedBeforeDetails', 'Please describe where this has been shared');
        isValid = false;
      }
      if (!form.values.idea2Articles.trim()) {
        form.setFieldError('idea2Articles', 'Relevant links, videos, or work samples are required');
        isValid = false;
      }
      if (!form.values.idea2NewSurprising.trim()) {
        form.setFieldError('idea2NewSurprising', 'Explain what makes this idea new/surprising');
        isValid = false;
      }
      if (!form.values.idea2Audience.trim()) {
        form.setFieldError('idea2Audience', 'Explain who would benefit most');
        isValid = false;
      }
    }

    if (stepKey === 'idea3') {
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
      if (!form.values.idea3Evidence.trim()) {
        form.setFieldError('idea3Evidence', 'Evidence/research supporting claims is required');
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
      if (form.values.idea3PresentedBefore === 'YES' && !form.values.idea3PresentedBeforeDetails.trim()) {
        form.setFieldError('idea3PresentedBeforeDetails', 'Please describe where this has been shared');
        isValid = false;
      }
      if (!form.values.idea3Articles.trim()) {
        form.setFieldError('idea3Articles', 'Relevant links, videos, or work samples are required');
        isValid = false;
      }
      if (!form.values.idea3NewSurprising.trim()) {
        form.setFieldError('idea3NewSurprising', 'Explain what makes this idea new/surprising');
        isValid = false;
      }
      if (!form.values.idea3Audience.trim()) {
        form.setFieldError('idea3Audience', 'Explain who would benefit most');
        isValid = false;
      }
    }

    if (stepKey === 'policy') {
      if (!form.values.soloPresentationConfirmed) {
        form.setFieldError('soloPresentationConfirmed', 'You must confirm the presentation is solo');
        isValid = false;
      }
      if (!form.values.durationConfirmed) {
        form.setFieldError('durationConfirmed', 'You must confirm the talk does not exceed 18 minutes');
        isValid = false;
      }
      if (!form.values.compliesConfirmed) {
        form.setFieldError('compliesConfirmed', 'You must confirm compliance with TEDx content guidelines');
        isValid = false;
      }
      if (form.values.guidelinesAligned !== 'YES') {
        form.setFieldError('guidelinesAligned', 'You must confirm alignment with TEDx content guidelines');
        isValid = false;
      }
      if (!form.values.howLearned.trim()) {
        form.setFieldError('howLearned', 'Information on how you learned about TEDxKARE is required');
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
    // Validate Step 4 Policy Confirmations
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

    const submitValues = {
      ...values,
      proposedTitle: values.idea1Title,
      proposedDescription: values.idea1Description,
      proposedQualifications: values.whySpeak1
    };

    try {
      await request(() => speakerAPI.submitSpeaker(submitValues));
      removeStoredDraft();
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

  const [storedDraft, setStoredDraft, removeStoredDraft] = useLocalStorage('tedxkare_speaker_draft', initialValues);
  const form = useForm(storedDraft, onSubmit);

  useEffect(() => {
    // Exclude large base64 file data to avoid localStorage QuotaExceededError
    const valuesCopy = { ...form.values };
    for (let i = 1; i <= 3; i++) {
      valuesCopy[`idea${i}File`] = '';
      valuesCopy[`idea${i}ImpactFile`] = '';
      valuesCopy[`idea${i}EvidenceFile`] = '';
      valuesCopy[`idea${i}PresentedBeforeFile`] = '';
    }
    setStoredDraft(valuesCopy);
  }, [form.values, setStoredDraft]);

  const isSelfNominated = form.values.selfNomination === 'Yes, I am nominating myself.';
  const hasAdditional = form.values.hasAdditionalIdeas === 'YES';

  const stepsList = [];
  let currentId = 1;
  stepsList.push({ id: currentId++, label: '1. Profile', key: 'profile' });
  if (!isSelfNominated) {
    stepsList.push({ id: currentId++, label: `${currentId - 1}. Nominator Info`, key: 'nominator' });
  }
  stepsList.push({ id: currentId++, label: `${currentId - 1}. Idea 1`, key: 'idea1' });
  stepsList.push({ id: currentId++, label: `${currentId - 1}. Idea 2`, key: 'idea2' });
  stepsList.push({ id: currentId++, label: `${currentId - 1}. Idea 3`, key: 'idea3' });
  stepsList.push({ id: currentId++, label: `${currentId - 1}. Policy Checks`, key: 'policy' });

  const currentStepKey = stepsList[step - 1]?.key || '';
  const totalSteps = stepsList.length;

  // Adjust step if it exceeds totalSteps (due to dynamic list resizing)
  useEffect(() => {
    if (step > totalSteps && totalSteps > 0) {
      setStep(totalSteps);
    }
  }, [totalSteps, step]);

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

  const renderIdeaStep = (num) => {
    const key = `idea${num}`;
    const stepTitle = num === 1 ? 'Primary Talk Idea Details' : num === 2 ? 'Second Talk Idea Details' : 'Third Talk Idea Details';
    
    return (
      <motion.div
        key={`step-idea${num}`}
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 15 }}
        className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-bold border-b border-gray-800 pb-3 text-ted-red flex items-center justify-between">
          <span className="flex items-center gap-2"><span>💡</span> Section 3: {stepTitle}</span>
        </h2>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-bold">Proposed Talk Title *</label>
              <input
                type="text"
                name={`${key}Title`}
                placeholder="Enter Talk Title"
                className={getInputClassName(`${key}Title`)}
                value={form.values[`${key}Title`]}
                onChange={form.handleChange}
                required
              />
              {form.errors[`${key}Title`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Title`]}</p>}
            </div>

            {/* Domain */}
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-bold">Domain / Category *</label>
              <select
                name={`${key}Domain`}
                className={getInputClassName(`${key}Domain`, 'select')}
                value={form.values[`${key}Domain`]}
                onChange={form.handleChange}
                required
              >
                <option value="">-- Select Domain --</option>
                <option value="Technology">Technology</option>
                <option value="Science">Science</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Social Impact">Social Impact</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Personal Development">Personal Development</option>
                <option value="Other">Other</option>
              </select>
              {form.errors[`${key}Domain`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Domain`]}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">Idea Summary (Recommended: 150–300 words. Explain concept, why it matters, and key insight) *</label>
            <textarea
              name={`${key}Description`}
              placeholder="Provide a detailed overview of the idea..."
              rows="4"
              className={getInputClassName(`${key}Description`, 'textarea')}
              value={form.values[`${key}Description`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}Description`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Description`]}</p>}
          </div>

          {/* Worth Spreading */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">What is the core message or key takeaway of this talk? *</label>
            <textarea
              name={`${key}WorthSpreading`}
              placeholder="Explain the concept's single most important message..."
              rows="3"
              className={getInputClassName(`${key}WorthSpreading`, 'textarea')}
              value={form.values[`${key}WorthSpreading`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}WorthSpreading`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}WorthSpreading`]}</p>}
          </div>

          {/* Relevance */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">Why is this idea particularly relevant today? *</label>
            <textarea
              name={`${key}Relevance`}
              placeholder="What current challenge, trend, opportunity, or societal need makes this idea timely and important?"
              rows="3"
              className={getInputClassName(`${key}Relevance`, 'textarea')}
              value={form.values[`${key}Relevance`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}Relevance`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Relevance`]}</p>}
          </div>

          {/* Challenge */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">What problem, gap, misconception, or challenge does this idea address? *</label>
            <textarea
              name={`${key}Challenge`}
              placeholder="Explain what challenge, misconception, or issue this idea aims to solve..."
              rows="3"
              className={getInputClassName(`${key}Challenge`, 'textarea')}
              value={form.values[`${key}Challenge`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}Challenge`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Challenge`]}</p>}
          </div>

          {/* Impact + Attachment */}
          <div className="space-y-2">
            <label className="text-xs text-gray-300 font-bold">What evidence demonstrates the impact of this idea or the speaker's work? *</label>
            <textarea
              name={`${key}Impact`}
              placeholder="Please share measurable outcomes, case studies, achievements, research findings, community impact, or other indicators of success..."
              rows="3"
              className={getInputClassName(`${key}Impact`, 'textarea')}
              value={form.values[`${key}Impact`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}Impact`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Impact`]}</p>}
            
            <div className="flex items-center gap-3 pt-1">
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                Upload Impact Proof
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, `${key}Impact`)}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </label>
              {form.values[`${key}ImpactFileName`] ? (
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                  <span className="text-[10px] text-gray-300 truncate max-w-xs">{form.values[`${key}ImpactFileName`]}</span>
                  <button
                    type="button"
                    onClick={() => clearFile(`${key}Impact`)}
                    className="text-red-500 hover:text-red-400 font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-gray-500">Optional impact document attachment (Max 10 MB)</span>
              )}
            </div>
            {form.errors[`${key}ImpactFile`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}ImpactFile`]}</p>}
          </div>

          {/* Evidence + Attachment */}
          <div className="space-y-2">
            <label className="text-xs text-gray-300 font-bold">What evidence, research, data, publications, or external sources support the claims made in this idea? *</label>
            <textarea
              name={`${key}Evidence`}
              placeholder="TEDx talks should be grounded in credible evidence, expertise, lived experience, or demonstrated impact. Please provide details or links..."
              rows="3"
              className={getInputClassName(`${key}Evidence`, 'textarea')}
              value={form.values[`${key}Evidence`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}Evidence`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Evidence`]}</p>}
            
            <div className="flex items-center gap-3 pt-1">
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                Upload Supporting Sources
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, `${key}Evidence`)}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </label>
              {form.values[`${key}EvidenceFileName`] ? (
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                  <span className="text-[10px] text-gray-300 truncate max-w-xs">{form.values[`${key}EvidenceFileName`]}</span>
                  <button
                    type="button"
                    onClick={() => clearFile(`${key}Evidence`)}
                    className="text-red-500 hover:text-red-400 font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-gray-500">Optional evidence document attachment (Max 10 MB)</span>
              )}
            </div>
            {form.errors[`${key}EvidenceFile`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}EvidenceFile`]}</p>}
          </div>

          {/* Scalability */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">Can this idea be applied, adapted, or replicated in other communities, industries, or contexts? Please explain. *</label>
            <textarea
              name={`${key}Scalability`}
              placeholder="Describe how this idea can be adapted by others..."
              rows="3"
              className={getInputClassName(`${key}Scalability`, 'textarea')}
              value={form.values[`${key}Scalability`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}Scalability`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Scalability`]}</p>}
          </div>

          {/* Lived Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-bold">Does the speaker have personal or lived experience connected to this idea? *</label>
              <select
                name={`${key}LivedExperience`}
                className={getInputClassName(`${key}LivedExperience`, 'select')}
                value={form.values[`${key}LivedExperience`]}
                onChange={form.handleChange}
                required
              >
                <option value="NO">NO</option>
                <option value="YES">YES</option>
              </select>
            </div>

            {/* Props */}
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-bold">Will the speaker use demonstrations, props, prototypes, multimedia, or physical materials? *</label>
              <select
                name={`${key}Props`}
                className={getInputClassName(`${key}Props`, 'select')}
                value={form.values[`${key}Props`]}
                onChange={form.handleChange}
                required
              >
                <option value="NO">NO</option>
                <option value="YES">YES</option>
              </select>
            </div>
          </div>

          {/* Lived Experience Details */}
          {form.values[`${key}LivedExperience`] === 'YES' && (
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-bold">If yes, how has the speaker's personal experience shaped their understanding of this idea and influenced their work? *</label>
              <textarea
                name={`${key}LivedExperienceDesc`}
                placeholder="Briefly explain details..."
                rows="3"
                className={getInputClassName(`${key}LivedExperienceDesc`, 'textarea')}
                value={form.values[`${key}LivedExperienceDesc`]}
                onChange={form.handleChange}
                required
              />
              {form.errors[`${key}LivedExperienceDesc`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}LivedExperienceDesc`]}</p>}
            </div>
          )}

          {/* Props Details */}
          {form.values[`${key}Props`] === 'YES' && (
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-bold">If yes, please provide details of any materials, equipment, demonstrations, or technical requirements. *</label>
              <textarea
                name={`${key}PropsDetails`}
                placeholder="Briefly explain details..."
                rows="3"
                className={getInputClassName(`${key}PropsDetails`, 'textarea')}
                value={form.values[`${key}PropsDetails`]}
                onChange={form.handleChange}
                required
              />
              {form.errors[`${key}PropsDetails`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}PropsDetails`]}</p>}
            </div>
          )}

          {/* Presented Before */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">Has the speaker presented this idea publicly before? *</label>
            <select
              name={`${key}PresentedBefore`}
              className={getInputClassName(`${key}PresentedBefore`, 'select')}
              value={form.values[`${key}PresentedBefore`]}
              onChange={form.handleChange}
              required
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>

          {/* Presented Before Details */}
          {form.values[`${key}PresentedBefore`] === 'YES' && (
            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-bold">If yes, please provide details of previous presentations, events, publications, podcasts, interviews, or platforms where this idea has been shared. *</label>
              <textarea
                name={`${key}PresentedBeforeDetails`}
                placeholder="Share details of where this has been presented..."
                rows="3"
                className={getInputClassName(`${key}PresentedBeforeDetails`, 'textarea')}
                value={form.values[`${key}PresentedBeforeDetails`]}
                onChange={form.handleChange}
                required
              />
              {form.errors[`${key}PresentedBeforeDetails`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}PresentedBeforeDetails`]}</p>}
              
              <div className="flex items-center gap-3 pt-1">
                <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                  Upload Presentation Proof
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, `${key}PresentedBefore`)}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </label>
                {form.values[`${key}PresentedBeforeFileName`] ? (
                  <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                    <span className="text-[10px] text-gray-300 truncate max-w-xs">{form.values[`${key}PresentedBeforeFileName`]}</span>
                    <button
                      type="button"
                      onClick={() => clearFile(`${key}PresentedBefore`)}
                      className="text-red-500 hover:text-red-400 font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500">Optional presentation document attachment (Max 10 MB)</span>
                )}
              </div>
              {form.errors[`${key}PresentedBeforeFile`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}PresentedBeforeFile`]}</p>}
            </div>
          )}

          {/* New / Surprising aspect */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">What makes this idea new, surprising, thought-provoking, or worth spreading? *</label>
            <textarea
              name={`${key}NewSurprising`}
              placeholder="Describe the unique insight, perspective, discovery, approach, or lesson that audiences are unlikely to have encountered before..."
              rows="3"
              className={getInputClassName(`${key}NewSurprising`, 'textarea')}
              value={form.values[`${key}NewSurprising`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}NewSurprising`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}NewSurprising`]}</p>}
          </div>

          {/* Target Audience */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">Who would benefit most from hearing this talk, and why? *</label>
            <textarea
              name={`${key}Audience`}
              placeholder="Describe the primary audience and the value, perspective, or action they may gain from this idea..."
              rows="3"
              className={getInputClassName(`${key}Audience`, 'textarea')}
              value={form.values[`${key}Audience`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}Audience`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Audience`]}</p>}
          </div>

          {/* Articles / work samples */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">Please share relevant links, videos, or work samples related to the speaker. *</label>
            <textarea
              name={`${key}Articles`}
              placeholder="Enter comma-separated URLs or details..."
              rows="3"
              className={getInputClassName(`${key}Articles`, 'textarea')}
              value={form.values[`${key}Articles`]}
              onChange={form.handleChange}
              required
            />
            {form.errors[`${key}Articles`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}Articles`]}</p>}
          </div>

          {/* Document upload (General/Additional) */}
          <div className="space-y-2">
            <label className="text-xs text-gray-300 font-bold block">Please upload any additional supporting documents or media related to the Speaker, if any</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                Choose Document
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, key)}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </label>
              {form.values[`${key}FileName`] ? (
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                  <span className="text-[10px] text-gray-300 truncate max-w-xs">{form.values[`${key}FileName`]}</span>
                  <button
                    type="button"
                    onClick={() => clearFile(key)}
                    className="text-red-500 hover:text-red-400 font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-gray-500">No file uploaded. Max size 10 MB.</span>
              )}
            </div>
            {form.errors[`${key}File`] && <p className="text-red-500 text-[10px]">{form.errors[`${key}File`]}</p>}
          </div>

          {/* Comments */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">Is there anything else the Selection Committee should know about this speaker or idea? (Optional)</label>
            <textarea
              name={`${key}Comments`}
              placeholder="Add any extra comments here..."
              rows="2"
              className={getInputClassName(`${key}Comments`, 'textarea')}
              value={form.values[`${key}Comments`]}
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
            {num === 1 ? (
              <>Next Section (Idea 2) <span>→</span></>
            ) : num === 2 ? (
              <>Next Section (Idea 3) <span>→</span></>
            ) : (
              <>Next Section (Policy Checks) <span>→</span></>
            )}
          </button>
        </div>
      </motion.div>
    );
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

                  {/* Will this be Speaker's first TEDx Talk? */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Will this be the Speaker's first TEDx Talk? *</label>
                    <select
                      name="firstTedxTalk"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.firstTedxTalk}
                      onChange={form.handleChange}
                      required
                    >
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
                    </select>
                    {form.errors.firstTedxTalk && <p className="text-red-500 text-[10px]">{form.errors.firstTedxTalk}</p>}
                  </div>

                  {/* Does the Speaker have any disability? */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Does the Speaker have any disability? *</label>
                    <select
                      name="hasDisability"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.hasDisability}
                      onChange={form.handleChange}
                      required
                    >
                      <option value="NO">No</option>
                      <option value="YES">Yes</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                    {form.errors.hasDisability && <p className="text-red-500 text-[10px]">{form.errors.hasDisability}</p>}
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

                {/* Disability details if YES */}
                {form.values.hasDisability === 'YES' && (
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Please specify any accessibility requirements or accommodations needed (Optional)</label>
                    <textarea
                      name="disabilityDetails"
                      placeholder="e.g. Wheelchair access, sign language interpreter, low lighting stage setups, etc..."
                      rows="2"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm resize-none"
                      value={form.values.disabilityDetails}
                      onChange={form.handleChange}
                    />
                  </div>
                )}

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

                  {/* Nominator Location */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-bold">Your Location (City, State/Province, Country) *</label>
                    <input
                      type="text"
                      name="nominatorLocation"
                      placeholder="e.g. Chennai, Tamil Nadu, India"
                      className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:border-ted-red focus:outline-none text-sm"
                      value={form.values.nominatorLocation}
                      onChange={form.handleChange}
                      required
                    />
                    {form.errors.nominatorLocation && <p className="text-red-500 text-[10px]">{form.errors.nominatorLocation}</p>}
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

            {/* ==================== SECTION 3: TALK IDEA DETAILS ==================== */}
            {currentStepKey === 'idea1' && renderIdeaStep(1)}
            {currentStepKey === 'idea2' && renderIdeaStep(2)}
            {currentStepKey === 'idea3' && renderIdeaStep(3)}

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
                  <span>📝</span> Section 4: Policies & Compliance
                </h2>

                <div className="space-y-5">


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
