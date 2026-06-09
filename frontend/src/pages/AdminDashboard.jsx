import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { applicantAPI, settingsAPI, speakerAPI } from '../utils/api';
import { storage, format, exportToCSV } from '../utils/helpers';

// ==================== ADMIN DASHBOARD ====================
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { loading, error, request } = useApi();

  // State
  const [activeTab, setActiveTab] = useState('applicants'); // 'applicants' or 'speakers'
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedShortlistDomain, setSelectedShortlistDomain] = useState('');
  
  // Speakers state
  const [speakers, setSpeakers] = useState([]);
  const [filteredSpeakers, setFilteredSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [speakerModalTab, setSpeakerModalTab] = useState('profile');

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
    nominationType: 'All',
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

  const [teamRegistrationOpen, setTeamRegistrationOpen] = useState(true);
  const [speakerRegistrationOpen, setSpeakerRegistrationOpen] = useState(true);

  // Fetch applicants, speakers and settings on component mount
  useEffect(() => {
    fetchApplicants();
    fetchSpeakers();
    fetchStatistics();
    fetchSettings();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({
      domain: 'All',
      status: 'All',
      search: '',
      nominationType: 'All',
    });
  };

  const fetchSettings = async () => {
    try {
      const response = await request(() => settingsAPI.getSettings());
      setTeamRegistrationOpen(response.data.teamRegistrationOpen ?? response.data.registrationOpen ?? true);
      setSpeakerRegistrationOpen(response.data.speakerRegistrationOpen ?? true);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleToggleTeamRegistration = async () => {
    try {
      const newState = !teamRegistrationOpen;
      await request(() => settingsAPI.updateSettings({ teamRegistrationOpen: newState }));
      setTeamRegistrationOpen(newState);
    } catch (error) {
      console.error('Error updating team registration status:', error);
    }
  };

  const handleToggleSpeakerRegistration = async () => {
    try {
      const newState = !speakerRegistrationOpen;
      await request(() => settingsAPI.updateSettings({ speakerRegistrationOpen: newState }));
      setSpeakerRegistrationOpen(newState);
    } catch (error) {
      console.error('Error updating speaker registration status:', error);
    }
  };

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [applicants, speakers, filters, activeTab]);

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

  // Fetch all speakers
  const fetchSpeakers = async () => {
    try {
      const response = await request(() => speakerAPI.getAllSpeakers());
      setSpeakers(response.data);
    } catch (error) {
      console.error('Error fetching speakers:', error);
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

  // Apply filters
  const applyFilters = () => {
    if (activeTab === 'applicants') {
      let filtered = applicants;

      // Status filter
      if (filters.status !== 'All') {
        filtered = filtered.filter((app) => app.status === filters.status);
      }

      // Domain filter
      if (filters.domain !== 'All') {
        filtered = filtered.filter(
          (app) => app.firstPreference === filters.domain || app.secondPreference === filters.domain
        );
      }

      // Search filter
      if (filters.search) {
        filtered = filtered.filter(
          (app) =>
            app.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            app.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setFilteredApplicants(filtered);
    } else {
      let filtered = speakers;

      // Status filter
      if (filters.status !== 'All') {
        filtered = filtered.filter((spk) => spk.status === filters.status);
      }

      // Nomination Type filter
      if (filters.nominationType && filters.nominationType !== 'All') {
        if (filters.nominationType === 'Self') {
          filtered = filtered.filter((spk) => spk.selfNomination === 'Yes, I am nominating myself.');
        } else if (filters.nominationType === 'Third-Party') {
          filtered = filtered.filter((spk) => spk.selfNomination !== 'Yes, I am nominating myself.');
        }
      }

      // Search filter
      if (filters.search) {
        filtered = filtered.filter(
          (spk) =>
            spk.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            spk.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            spk.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            (spk.nominatorName && spk.nominatorName.toLowerCase().includes(filters.search.toLowerCase()))
        );
      }

      setFilteredSpeakers(filtered);
    }
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

  // Update speaker status
  const handleSpeakerStatusChange = async (id, newStatus) => {
    try {
      await request(() => speakerAPI.updateSpeaker(id, { status: newStatus }));

      // Update local state
      setSpeakers((prev) =>
        prev.map((spk) => (spk._id === id ? { ...spk, status: newStatus } : spk))
      );

      if (selectedSpeaker?._id === id) {
        setSelectedSpeaker((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }
    } catch (error) {
      console.error('Error updating speaker status:', error);
    }
  };

  // Delete speaker
  const handleSpeakerDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this speaker application?')) return;

    try {
      await request(() => speakerAPI.deleteSpeaker(id));
      setSpeakers((prev) => prev.filter((spk) => spk._id !== id));
      setShowSpeakerModal(false);
    } catch (error) {
      console.error('Error deleting speaker:', error);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (activeTab === 'applicants') {
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
    } else {
      const exportData = filteredSpeakers.map((spk) => ({
        Name: spk.name,
        Email: spk.email,
        Phone: spk.phone || '',
        Profession: spk.profession || '',
        Organization: spk.organization || '',
        Location: spk.location || '',
        LinkedIn: spk.linkedin || '',
        'Additional Links': spk.additionalLinks || '',
        'First TEDx Talk': spk.firstTedxTalk || 'YES',
        'Has Disability': spk.hasDisability || 'NO',
        'Disability Details': spk.disabilityDetails || '',
        'Nomination Type': spk.selfNomination || 'Yes, I am nominating myself.',
        'Nominator Name': spk.nominatorName || '',
        'Nominator Email': spk.nominatorEmail || '',
        'Nominator Phone': spk.nominatorPhone || '',
        'Nominator Location': spk.nominatorLocation || '',
        'Nominator Organization': spk.nominatorOrganization || '',
        'Nominator Relationship': spk.nominatorRelationship || '',
        'Why Should Speak': spk.whySpeak1 || spk.whyApply || '',
        'Idea 1 Title': spk.idea1Title || spk.title || '',
        'Idea 1 Domain': spk.idea1Domain || spk.idea1DomainLegacy || '',
        'Idea 1 Worth Spreading': spk.idea1WorthSpreading || spk.idea1Sentence || '',
        'Idea 1 Description': spk.idea1Description || spk.idea1DescriptionLegacy || spk.abstract || '',
        'Idea 1 Relevance': spk.idea1Relevance || '',
        'Idea 1 Challenge': spk.idea1Challenge || '',
        'Idea 1 Impact': spk.idea1Impact || '',
        'Idea 1 Impact File': spk.idea1ImpactFileName || '',
        'Idea 1 Evidence': spk.idea1Evidence || '',
        'Idea 1 Evidence File': spk.idea1EvidenceFileName || '',
        'Idea 1 Scalability': spk.idea1Scalability || '',
        'Idea 1 Lived Experience': spk.idea1LivedExperience || '',
        'Idea 1 Lived Experience Desc': spk.idea1LivedExperienceDesc || '',
        'Idea 1 Props': spk.idea1Props || '',
        'Idea 1 Props Details': spk.idea1PropsDetails || '',
        'Idea 1 Presented Before': spk.idea1PresentedBefore || '',
        'Idea 1 Presented Before Details': spk.idea1PresentedBeforeDetails || '',
        'Idea 1 Presented Before File': spk.idea1PresentedBeforeFileName || '',
        'Idea 1 Articles': spk.idea1Articles || '',
        'Idea 1 New Surprising': spk.idea1NewSurprising || '',
        'Idea 1 Target Audience': spk.idea1Audience || '',
        'Idea 1 Comments': spk.idea1Comments || '',
        'Idea 2 Title': spk.idea2Title || '',
        'Idea 2 Domain': spk.idea2Domain || spk.idea2DomainLegacy || '',
        'Idea 2 Worth Spreading': spk.idea2WorthSpreading || spk.idea2Sentence || '',
        'Idea 2 Description': spk.idea2Description || spk.idea2DescriptionLegacy || '',
        'Idea 2 Relevance': spk.idea2Relevance || '',
        'Idea 2 Challenge': spk.idea2Challenge || '',
        'Idea 2 Impact': spk.idea2Impact || '',
        'Idea 2 Impact File': spk.idea2ImpactFileName || '',
        'Idea 2 Evidence': spk.idea2Evidence || '',
        'Idea 2 Evidence File': spk.idea2EvidenceFileName || '',
        'Idea 2 Scalability': spk.idea2Scalability || '',
        'Idea 2 Lived Experience': spk.idea2LivedExperience || '',
        'Idea 2 Lived Experience Desc': spk.idea2LivedExperienceDesc || '',
        'Idea 2 Props': spk.idea2Props || '',
        'Idea 2 Props Details': spk.idea2PropsDetails || '',
        'Idea 2 Presented Before': spk.idea2PresentedBefore || '',
        'Idea 2 Presented Before Details': spk.idea2PresentedBeforeDetails || '',
        'Idea 2 Presented Before File': spk.idea2PresentedBeforeFileName || '',
        'Idea 2 Articles': spk.idea2Articles || '',
        'Idea 2 New Surprising': spk.idea2NewSurprising || '',
        'Idea 2 Target Audience': spk.idea2Audience || '',
        'Idea 2 Comments': spk.idea2Comments || '',
        'Idea 3 Title': spk.idea3Title || '',
        'Idea 3 Domain': spk.idea3Domain || spk.idea3DomainLegacy || '',
        'Idea 3 Worth Spreading': spk.idea3WorthSpreading || spk.idea3Sentence || '',
        'Idea 3 Description': spk.idea3Description || spk.idea3DescriptionLegacy || '',
        'Idea 3 Relevance': spk.idea3Relevance || '',
        'Idea 3 Challenge': spk.idea3Challenge || '',
        'Idea 3 Impact': spk.idea3Impact || '',
        'Idea 3 Impact File': spk.idea3ImpactFileName || '',
        'Idea 3 Evidence': spk.idea3Evidence || '',
        'Idea 3 Evidence File': spk.idea3EvidenceFileName || '',
        'Idea 3 Scalability': spk.idea3Scalability || '',
        'Idea 3 Lived Experience': spk.idea3LivedExperience || '',
        'Idea 3 Lived Experience Desc': spk.idea3LivedExperienceDesc || '',
        'Idea 3 Props': spk.idea3Props || '',
        'Idea 3 Props Details': spk.idea3PropsDetails || '',
        'Idea 3 Presented Before': spk.idea3PresentedBefore || '',
        'Idea 3 Presented Before Details': spk.idea3PresentedBeforeDetails || '',
        'Idea 3 Presented Before File': spk.idea3PresentedBeforeFileName || '',
        'Idea 3 Articles': spk.idea3Articles || '',
        'Idea 3 New Surprising': spk.idea3NewSurprising || '',
        'Idea 3 Target Audience': spk.idea3Audience || '',
        'Idea 3 Comments': spk.idea3Comments || '',
        'Proposed Talk Title': spk.proposedTitle || spk.title || '',
        'Proposed Abstract': spk.proposedDescription || spk.abstract || '',
        'Proposed Qualifications': spk.proposedQualifications || spk.background || '',
        'Sample Presentation Link': spk.sampleLink || '',
        'Policy Comfort': spk.policyComfort || '',
        'Fact-Checking Need': spk.factCheckingNeed || '',
        'Willingness to Modify': spk.willingnessToModify || '',
        'Solo Presentation Confirmed': spk.soloPresentationConfirmed ? 'Yes' : 'No',
        'Duration Confirmed': spk.durationConfirmed ? 'Yes' : 'No',
        'Complies Confirmed': spk.compliesConfirmed ? 'Yes' : 'No',
        'Guidelines Aligned': spk.guidelinesAligned || '',
        'Has Additional Ideas': spk.hasAdditionalIdeas || 'NO',
        'How Learned': spk.howLearned || '',
        Status: spk.status,
        'Submitted On': format.date(spk.createdAt),
      }));

      exportToCSV(exportData, `tedxkare-speakers-${Date.now()}.csv`);
    }
  };

  // Logout
  const handleLogout = () => {
    storage.clearAdmin();
    navigate('/ad');
  };

  // Download Base64 File Attachment
  const downloadBase64File = (base64Data, fileName) => {
    if (!base64Data) return;
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName || 'attachment';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Helper to render Idea Tab Content inside the speaker modal
  const renderSpeakerModalIdeaTab = (num) => {
    const key = `idea${num}`;
    const ideaTitle = selectedSpeaker[`${key}Title`] || (num === 1 ? selectedSpeaker.title : '') || 'N/A';
    const ideaDomain = selectedSpeaker[`${key}Domain`] || (num === 1 ? (selectedSpeaker.idea1DomainLegacy || selectedSpeaker.domain) : '') || 'N/A';
    const ideaWorthSpreading = selectedSpeaker[`${key}WorthSpreading`] || (num === 1 ? selectedSpeaker.idea1Sentence : '') || 'N/A';
    const ideaDescription = selectedSpeaker[`${key}Description`] || (num === 1 ? (selectedSpeaker.idea1DescriptionLegacy || selectedSpeaker.abstract) : '') || 'N/A';
    const ideaRelevance = selectedSpeaker[`${key}Relevance`] || 'N/A';
    const ideaChallenge = selectedSpeaker[`${key}Challenge`] || 'N/A';
    const ideaImpact = selectedSpeaker[`${key}Impact`] || 'N/A';
    const ideaEvidence = selectedSpeaker[`${key}Evidence`] || 'N/A';
    const ideaScalability = selectedSpeaker[`${key}Scalability`] || 'N/A';
    const ideaLivedExperience = selectedSpeaker[`${key}LivedExperience`] || 'NO';
    const ideaLivedExperienceDesc = selectedSpeaker[`${key}LivedExperienceDesc`] || '';
    const ideaProps = selectedSpeaker[`${key}Props`] || 'NO';
    const ideaPropsDetails = selectedSpeaker[`${key}PropsDetails`] || '';
    const ideaPresentedBefore = selectedSpeaker[`${key}PresentedBefore`] || 'NO';
    const ideaPresentedBeforeDetails = selectedSpeaker[`${key}PresentedBeforeDetails`] || '';
    const ideaArticles = selectedSpeaker[`${key}Articles`] || 'N/A';
    const ideaNewSurprising = selectedSpeaker[`${key}NewSurprising`] || 'N/A';
    const ideaAudience = selectedSpeaker[`${key}Audience`] || 'N/A';
    const ideaComments = selectedSpeaker[`${key}Comments`] || '';

    // Files
    const generalFile = selectedSpeaker[`${key}File`];
    const generalFileName = selectedSpeaker[`${key}FileName`];
    const impactFile = selectedSpeaker[`${key}ImpactFile`];
    const impactFileName = selectedSpeaker[`${key}ImpactFileName`];
    const evidenceFile = selectedSpeaker[`${key}EvidenceFile`];
    const evidenceFileName = selectedSpeaker[`${key}EvidenceFileName`];
    const presentedBeforeFile = selectedSpeaker[`${key}PresentedBeforeFile`];
    const presentedBeforeFileName = selectedSpeaker[`${key}PresentedBeforeFileName`];

    return (
      <div className="space-y-6">
        <div className="bg-black/40 border border-gray-800/85 p-5 rounded-xl space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-3 border-b border-gray-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ted-red bg-red-950/40 border border-red-500/20 px-2.5 py-0.5 rounded-full mb-1 inline-block">
                {num === 1 ? 'Primary Idea' : num === 2 ? 'Second Idea (Optional)' : 'Third Idea (Optional)'}
              </span>
              <h4 className="text-lg font-bold text-white mt-1">{ideaTitle}</h4>
            </div>
            <div className="md:text-right">
              <span className="text-xs text-gray-400 block font-medium">Domain / Category:</span>
              <span className="text-sm font-semibold text-white">{ideaDomain}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {/* Crux / Worth Spreading */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">The "Idea Worth Spreading" Crux:</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800 italic">
                "{ideaWorthSpreading}"
              </p>
            </div>

            {/* Description */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Detailed Description:</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                {ideaDescription}
              </p>
            </div>

            {/* Why relevant */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Relevance in Today's World:</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                {ideaRelevance}
              </p>
            </div>

            {/* Challenge / Gap */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Challenge / Issue / Gap Addressed:</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                {ideaChallenge}
              </p>
            </div>

            {/* Impact */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Measurable / Meaningful Impact:</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                {ideaImpact}
              </p>
            </div>

            {/* Evidence & Sources */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Evidence, Research & Sources:</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                {ideaEvidence}
              </p>
            </div>

            {/* Scalability */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Scalability & Adaptability:</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                {ideaScalability}
              </p>
            </div>

            {/* Lived Experience */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/30 border border-gray-800 p-3 rounded-xl">
              <div className="col-span-1">
                <span className="text-xs text-gray-400 font-bold block">Lived Experience?</span>
                <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${ideaLivedExperience === 'YES' ? 'bg-green-950/60 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-400'}`}>
                  {ideaLivedExperience}
                </span>
              </div>
              {ideaLivedExperience === 'YES' && ideaLivedExperienceDesc && (
                <div className="col-span-2 text-xs">
                  <span className="text-gray-400 block font-bold">Details:</span>
                  <p className="text-gray-300">{ideaLivedExperienceDesc}</p>
                </div>
              )}
            </div>

            {/* Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/30 border border-gray-800 p-3 rounded-xl">
              <div className="col-span-1">
                <span className="text-xs text-gray-400 font-bold block">Requires Props/Materials?</span>
                <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${ideaProps === 'YES' ? 'bg-yellow-950/60 text-yellow-400 border border-yellow-500/20' : 'bg-gray-800 text-gray-400'}`}>
                  {ideaProps}
                </span>
              </div>
              {ideaProps === 'YES' && ideaPropsDetails && (
                <div className="col-span-2 text-xs">
                  <span className="text-gray-400 block font-bold">Details:</span>
                  <p className="text-gray-300">{ideaPropsDetails}</p>
                </div>
              )}
            </div>

            {/* Presented Before */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/30 border border-gray-800 p-3 rounded-xl">
              <div className="col-span-1">
                <span className="text-xs text-gray-400 font-bold block">Presented Publicly Before?</span>
                <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${ideaPresentedBefore === 'YES' ? 'bg-purple-950/60 text-purple-400 border border-purple-500/20' : 'bg-gray-800 text-gray-400'}`}>
                  {ideaPresentedBefore}
                </span>
              </div>
              {ideaPresentedBefore === 'YES' && ideaPresentedBeforeDetails && (
                <div className="col-span-2 text-xs">
                  <span className="text-gray-400 block font-bold">Details:</span>
                  <p className="text-gray-300">{ideaPresentedBeforeDetails}</p>
                </div>
              )}
            </div>

            {/* New / Surprising aspect */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">What makes this idea new, surprising, or thought-provoking?</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                {ideaNewSurprising}
              </p>
            </div>

            {/* Target Audience */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Target Audience & Who Benefits Most:</span>
              <p className="text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                {ideaAudience}
              </p>
            </div>

            {/* Articles / Links */}
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Work Samples / Relevant Links:</span>
              <p className="text-gray-300 whitespace-pre-line bg-black/40 border border-gray-800 p-3 rounded-xl text-xs leading-relaxed">
                {ideaArticles}
              </p>
            </div>

            {/* Attachments Section */}
            <div className="pt-4 border-t border-gray-800/80 space-y-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Supporting Attachments</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* General File */}
                <div className="bg-gray-800/40 border border-gray-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">General Attachment</p>
                    <p className="text-xs font-medium text-white truncate mt-0.5">{generalFileName || 'None'}</p>
                  </div>
                  {generalFile && (
                    <button
                      type="button"
                      onClick={() => downloadBase64File(generalFile, generalFileName)}
                      className="px-2.5 py-1.5 bg-ted-red hover:bg-red-700 text-white rounded-md text-[10px] font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      Download
                    </button>
                  )}
                </div>

                {/* Impact File */}
                <div className="bg-gray-800/40 border border-gray-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Impact Attachment</p>
                    <p className="text-xs font-medium text-white truncate mt-0.5">{impactFileName || 'None'}</p>
                  </div>
                  {impactFile && (
                    <button
                      type="button"
                      onClick={() => downloadBase64File(impactFile, impactFileName)}
                      className="px-2.5 py-1.5 bg-ted-red hover:bg-red-700 text-white rounded-md text-[10px] font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      Download
                    </button>
                  )}
                </div>

                {/* Evidence File */}
                <div className="bg-gray-800/40 border border-gray-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Evidence Attachment</p>
                    <p className="text-xs font-medium text-white truncate mt-0.5">{evidenceFileName || 'None'}</p>
                  </div>
                  {evidenceFile && (
                    <button
                      type="button"
                      onClick={() => downloadBase64File(evidenceFile, evidenceFileName)}
                      className="px-2.5 py-1.5 bg-ted-red hover:bg-red-700 text-white rounded-md text-[10px] font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      Download
                    </button>
                  )}
                </div>

                {/* Presented Before File */}
                <div className="bg-gray-800/40 border border-gray-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Presentation Attachment</p>
                    <p className="text-xs font-medium text-white truncate mt-0.5">{presentedBeforeFileName || 'None'}</p>
                  </div>
                  {presentedBeforeFile && (
                    <button
                      type="button"
                      onClick={() => downloadBase64File(presentedBeforeFile, presentedBeforeFileName)}
                      className="px-2.5 py-1.5 bg-ted-red hover:bg-red-700 text-white rounded-md text-[10px] font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Comments */}
            {ideaComments && (
              <div className="pt-2 border-t border-gray-850">
                <span className="text-xs text-gray-400 block mb-1 font-bold">Additional Comments / Remarks:</span>
                <p className="bg-gray-800/20 border border-gray-800 p-3 rounded-xl text-xs text-gray-300 italic">
                  "{ideaComments}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* ==================== TOP NAVIGATION ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container-flex h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-ted-red font-bold">TEDx</span>
            <span className="text-white font-light">KARE Admin</span>
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
            <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-gray-400">
              View and manage all recruitment and speaker applications. Currently showing{' '}
              <span className="text-ted-red font-semibold">
                {activeTab === 'applicants' ? filteredApplicants.length : filteredSpeakers.length}
              </span>{' '}
              of{' '}
              <span className="text-ted-red font-semibold">
                {activeTab === 'applicants' ? applicants.length : speakers.length}
              </span>{' '}
              records.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 bg-gray-900/40 backdrop-blur-md p-4 rounded-2xl border border-gray-800 shadow-lg">
            {/* Team Toggle */}
            <div className="flex items-center justify-between gap-6 border-b sm:border-b-0 sm:border-r border-gray-800 pb-3 sm:pb-0 sm:pr-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-0.5 uppercase tracking-wider">Team Recruitment</p>
                <p className={`text-xs font-bold ${teamRegistrationOpen ? 'text-green-400' : 'text-red-400'}`}>
                  {teamRegistrationOpen ? '🟢 Open' : '🔴 Closed'}
                </p>
              </div>
              <button
                onClick={handleToggleTeamRegistration}
                disabled={loading}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                  teamRegistrationOpen ? 'bg-ted-red' : 'bg-gray-800 border border-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    teamRegistrationOpen ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Speaker Toggle */}
            <div className="flex items-center justify-between gap-6 sm:pl-2">
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-0.5 uppercase tracking-wider">Speaker Applications</p>
                <p className={`text-xs font-bold ${speakerRegistrationOpen ? 'text-green-400' : 'text-red-400'}`}>
                  {speakerRegistrationOpen ? '🟢 Open' : '🔴 Closed'}
                </p>
              </div>
              <button
                onClick={handleToggleSpeakerRegistration}
                disabled={loading}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                  speakerRegistrationOpen ? 'bg-ted-red' : 'bg-gray-800 border border-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    speakerRegistrationOpen ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ==================== TABS CONTAINER ==================== */}
        <div className="flex gap-6 border-b border-gray-800 mb-8 pb-px">
          <button
            onClick={() => handleTabChange('applicants')}
            className={`pb-4 px-2 font-bold text-lg border-b-2 transition-all duration-300 ${
              activeTab === 'applicants' ? 'text-ted-red border-ted-red' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            👥 Team Applicants
          </button>
          <button
            onClick={() => handleTabChange('speakers')}
            className={`pb-4 px-2 font-bold text-lg border-b-2 transition-all duration-300 ${
              activeTab === 'speakers' ? 'text-ted-red border-ted-red' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            🎙️ Speaker Applications
          </button>
        </div>

        {/* ==================== STATISTICS CARDS ==================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {/* Total */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <p className="text-gray-400 text-sm mb-2">
              Total Applications
            </p>
            <p className="text-4xl font-bold text-ted-red">
              {activeTab === 'applicants' ? stats.totalApplications : speakers.length}
            </p>
          </motion.div>

          {/* Pending */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card border-yellow-500/30"
          >
            <p className="text-yellow-400 text-sm mb-2">Pending Review</p>
            <p className="text-4xl font-bold text-yellow-400">
              {activeTab === 'applicants' 
                ? stats.byStatus.pending 
                : speakers.filter(s => s.status === 'Pending').length}
            </p>
          </motion.div>

          {/* Shortlisted / Selected */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card border-green-500/30"
          >
            <p className="text-green-400 text-sm mb-2">
              {activeTab === 'applicants' ? 'Shortlisted' : 'Selected Speakers'}
            </p>
            <p className="text-4xl font-bold text-green-400">
              {activeTab === 'applicants' 
                ? stats.byStatus.shortlisted 
                : speakers.filter(s => s.status === 'Selected').length}
            </p>
          </motion.div>

          {/* Rejected */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card border-red-500/30"
          >
            <p className="text-red-400 text-sm mb-2">Rejected</p>
            <p className="text-4xl font-bold text-red-400">
              {activeTab === 'applicants' 
                ? stats.byStatus.rejected 
                : speakers.filter(s => s.status === 'Rejected').length}
            </p>
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
              placeholder={activeTab === 'applicants' ? "Search by name or email..." : "Search by name, email, or talk title..."}
              className={`input-field ${activeTab === 'applicants' ? 'col-span-1 md:col-span-2' : 'col-span-1 md:col-span-2'}`}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />

            {/* Domain Filter (Only for Team Applicants) */}
            {activeTab === 'applicants' && (
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
            )}

            {/* Nomination Type Filter (Only for Speaker Applications) */}
            {activeTab === 'speakers' && (
              <select
                className="input-field appearance-none bg-gray-900 bg-right bg-no-repeat pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                }}
                value={filters.nominationType || 'All'}
                onChange={(e) => setFilters({ ...filters, nominationType: e.target.value })}
              >
                <option value="All">All Nominations</option>
                <option value="Self">Self-Nominations</option>
                <option value="Third-Party">Third-Party Nominations</option>
              </select>
            )}

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
              {activeTab === 'applicants' ? (
                <>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </>
              ) : (
                <>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-sm mt-4 w-full"
          >
            📥 Export {activeTab === 'applicants' ? 'Applicants' : 'Speakers'} to CSV
          </button>
        </motion.div>

        {/* ==================== CONTENT TABLE ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card overflow-x-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">Loading data...</p>
            </div>
          ) : activeTab === 'applicants' ? (
            // APPLICANTS TABLE
            filteredApplicants.length > 0 ? (
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
            )
          ) : (
            // SPEAKERS TABLE
            filteredSpeakers.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 font-semibold">Talk Title</th>
                    <th className="text-left py-4 px-4 font-semibold">Speaker</th>
                    <th className="text-left py-4 px-4 font-semibold">Nomination Type</th>
                    <th className="text-left py-4 px-4 font-semibold">Email</th>
                    <th className="text-left py-4 px-4 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 font-semibold">Submitted</th>
                    <th className="text-left py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpeakers.map((speaker, index) => (
                    <motion.tr
                      key={speaker._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium truncate max-w-[200px]">{speaker.title}</td>
                      <td className="py-4 px-4">{speaker.name}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          speaker.selfNomination === 'Yes, I am nominating myself.'
                            ? 'bg-blue-900/30 text-blue-300 border-blue-500/50'
                            : 'bg-purple-900/30 text-purple-300 border-purple-500/50'
                        }`}>
                          {speaker.selfNomination === 'Yes, I am nominating myself.' ? 'Self' : 'Third-Party'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400">{speaker.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            speaker.status
                          )}`}
                        >
                          {speaker.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-xs">
                        {format.date(speaker.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => {
                            setSelectedSpeaker(speaker);
                            setShowSpeakerModal(true);
                            setSpeakerModalTab('profile');
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
                <p className="text-gray-400">No speaker applications found matching your filters</p>
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* ==================== APPLICANT DETAIL MODAL ==================== */}
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
                    <p className="text-gray-400 mb-2">Why <span className="text-ted-red font-bold">TEDx</span><span className="text-white font-light">KARE</span>?</p>
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
                      <label htmlFor="shortlist-role" className="text-sm text-gray-400 mb-1 block">Shortlist for Role:</label>
                      <select
                        id="shortlist-role"
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

      {/* ==================== SPEAKER DETAIL MODAL ==================== */}
      {showSpeakerModal && selectedSpeaker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSpeakerModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="border-b border-gray-800 bg-gray-900 p-6 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-2xl font-bold">Application Details</h3>
                <p className="text-xs text-gray-400 mt-1">Speaker: <span className="font-semibold text-ted-red">{selectedSpeaker.name}</span></p>
              </div>
              <button
                onClick={() => setShowSpeakerModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Inner Tabs */}
            <div className="flex border-b border-gray-800 bg-gray-950 px-6 pt-3 gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin shrink-0">
              <button
                type="button"
                onClick={() => setSpeakerModalTab('profile')}
                className={`pb-3 px-1 font-semibold text-xs md:text-sm border-b-2 transition-all duration-200 ${
                  speakerModalTab === 'profile' ? 'text-ted-red border-ted-red' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                👤 Profile
              </button>
              <button
                type="button"
                onClick={() => setSpeakerModalTab('idea1')}
                className={`pb-3 px-1 font-semibold text-xs md:text-sm border-b-2 transition-all duration-200 ${
                  speakerModalTab === 'idea1' ? 'text-ted-red border-ted-red' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                💡 Idea 1
              </button>
              {(selectedSpeaker.idea2Title || selectedSpeaker.idea2Sentence) && (
                <button
                  type="button"
                  onClick={() => setSpeakerModalTab('idea2')}
                  className={`pb-3 px-1 font-semibold text-xs md:text-sm border-b-2 transition-all duration-200 ${
                    speakerModalTab === 'idea2' ? 'text-ted-red border-ted-red' : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  💡 Idea 2
                </button>
              )}
              {(selectedSpeaker.idea3Title || selectedSpeaker.idea3Sentence) && (
                <button
                  type="button"
                  onClick={() => setSpeakerModalTab('idea3')}
                  className={`pb-3 px-1 font-semibold text-xs md:text-sm border-b-2 transition-all duration-200 ${
                    speakerModalTab === 'idea3' ? 'text-ted-red border-ted-red' : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  💡 Idea 3
                </button>
              )}
              <button
                type="button"
                onClick={() => setSpeakerModalTab('policy')}
                className={`pb-3 px-1 font-semibold text-xs md:text-sm border-b-2 transition-all duration-200 ${
                  speakerModalTab === 'policy' ? 'text-ted-red border-ted-red' : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                📜 Policy & Talk Details
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
              {/* TAB 1: Profile */}
              {speakerModalTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-ted-red font-bold mb-3 flex items-center gap-1.5">
                      <span>👤</span> Speaker Profile Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-black/40 border border-gray-800/85 p-5 rounded-xl">
                      <div>
                        <p className="text-gray-400 text-xs">Full Name</p>
                        <p className="font-semibold text-white text-base mt-0.5">{selectedSpeaker.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Nomination Type</p>
                        <p className="font-semibold text-white text-base mt-0.5">{selectedSpeaker.selfNomination || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Email Address</p>
                        <p className="font-semibold text-white break-all mt-0.5">{selectedSpeaker.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Phone Number</p>
                        <p className="font-semibold text-white mt-0.5">{selectedSpeaker.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Profession / Designation</p>
                        <p className="font-semibold text-white mt-0.5">{selectedSpeaker.profession || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Company / Institution / Org</p>
                        <p className="font-semibold text-white mt-0.5">{selectedSpeaker.organization || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Current Location</p>
                        <p className="font-semibold text-white mt-0.5">{selectedSpeaker.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">LinkedIn Profile</p>
                        {selectedSpeaker.linkedin ? (
                          <a
                            href={selectedSpeaker.linkedin.startsWith('http') ? selectedSpeaker.linkedin : `https://${selectedSpeaker.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ted-red hover:underline font-semibold break-all mt-0.5 inline-block"
                          >
                            {selectedSpeaker.linkedin}
                          </a>
                        ) : (
                          <p className="text-gray-500 italic mt-0.5">Not provided</p>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">First TEDx Talk?</p>
                        <p className="font-semibold text-white mt-0.5">{selectedSpeaker.firstTedxTalk || 'YES'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Has Disability?</p>
                        <p className="font-semibold text-white mt-0.5">{selectedSpeaker.hasDisability || 'NO'}</p>
                      </div>
                      {selectedSpeaker.hasDisability === 'YES' && (
                        <div className="md:col-span-2">
                          <p className="text-gray-400 text-xs">Disability/Accommodations Details</p>
                          <p className="font-semibold text-white mt-0.5 bg-black/60 p-2.5 rounded-xl border border-gray-800 leading-relaxed text-xs">{selectedSpeaker.disabilityDetails || 'None specified'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {(selectedSpeaker.selfNomination === 'No, I am nominating another individual.' || selectedSpeaker.nominatorName) && (
                    <div>
                      <h4 className="text-ted-red font-bold mb-3 flex items-center gap-1.5 mt-6">
                        <span>👤</span> Nominator Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-black/40 border border-gray-800/85 p-5 rounded-xl">
                        <div>
                          <p className="text-gray-400 text-xs">Nominator Full Name</p>
                          <p className="font-semibold text-white text-base mt-0.5">{selectedSpeaker.nominatorName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Relationship with Speaker</p>
                          <p className="font-semibold text-white text-base mt-0.5">{selectedSpeaker.nominatorRelationship || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Nominator Email Address</p>
                          <p className="font-semibold text-white break-all mt-0.5">{selectedSpeaker.nominatorEmail || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Nominator Phone Number</p>
                          <p className="font-semibold text-white mt-0.5">{selectedSpeaker.nominatorPhone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Nominator Location</p>
                          <p className="font-semibold text-white mt-0.5">{selectedSpeaker.nominatorLocation || 'N/A'}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <p className="text-gray-400 text-xs">Nominator Organization</p>
                          <p className="font-semibold text-white mt-0.5">{selectedSpeaker.nominatorOrganization || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSpeaker.additionalLinks && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1.5">Additional Professional Links:</p>
                      <div className="bg-black/30 border border-gray-800 p-3 rounded-xl flex flex-col gap-1.5">
                        {selectedSpeaker.additionalLinks.split(',').map((link, idx) => {
                          const trimmed = link.trim();
                          if (!trimmed) return null;
                          const href = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
                          return (
                            <a
                              key={idx}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-ted-red hover:underline font-medium text-sm break-all"
                            >
                              🔗 {trimmed}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedSpeaker.whySpeak1 && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1.5">Why should this speaker speak at TEDxKARE?</p>
                      <p className="bg-gray-800/40 border border-gray-800 p-4 rounded-xl text-sm leading-relaxed text-gray-300">
                        {selectedSpeaker.whySpeak1}
                      </p>
                    </div>
                  )}

                  {selectedSpeaker.whyApply && !selectedSpeaker.whySpeak1 && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1.5">Why are they applying? (Legacy):</p>
                      <p className="bg-gray-800/40 border border-gray-800 p-4 rounded-xl text-sm leading-relaxed text-gray-300">
                        {selectedSpeaker.whyApply}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Idea 1 */}
              {speakerModalTab === 'idea1' && renderSpeakerModalIdeaTab(1)}

              {/* TAB 3: Idea 2 */}
              {speakerModalTab === 'idea2' && (selectedSpeaker.idea2Title || selectedSpeaker.idea2Sentence) && renderSpeakerModalIdeaTab(2)}

              {/* TAB 4: Idea 3 */}
              {speakerModalTab === 'idea3' && (selectedSpeaker.idea3Title || selectedSpeaker.idea3Sentence) && renderSpeakerModalIdeaTab(3)}

              {/* TAB 5: Policy & Confirmations */}
              {speakerModalTab === 'policy' && (
                <div className="space-y-6">
                  <div className="bg-black/40 border border-gray-800/85 p-5 rounded-xl space-y-4">
                    <h4 className="text-ted-red font-bold flex items-center gap-1.5 border-b border-gray-800 pb-3">
                      <span>🎙️</span> Proposed Talk Details & Confirmations
                    </h4>

                    <div className="space-y-4 text-sm">
                      {/* Proposed Title */}
                      <div>
                        <p className="text-gray-400 text-xs font-bold">Proposed Talk Title</p>
                        <p className="font-semibold text-white text-base mt-0.5">{selectedSpeaker.proposedTitle || selectedSpeaker.title || 'N/A'}</p>
                      </div>

                      {/* Originality / Abstract */}
                      <div>
                        <p className="text-gray-400 text-xs font-bold">Originality & Abstract (Why they should share it):</p>
                        <p className="bg-black/60 border border-gray-800 p-3 rounded-xl text-gray-300 mt-1 leading-relaxed">
                          {selectedSpeaker.proposedDescription || selectedSpeaker.abstract || 'N/A'}
                        </p>
                      </div>

                      {/* Qualifications */}
                      <div>
                        <p className="text-gray-400 text-xs font-bold">Qualifications, Credentials & Achievements:</p>
                        <p className="bg-black/60 border border-gray-800 p-3 rounded-xl text-gray-300 mt-1 leading-relaxed">
                          {selectedSpeaker.proposedQualifications || selectedSpeaker.background || 'N/A'}
                        </p>
                      </div>

                      {/* Sample presentation/slides link */}
                      {selectedSpeaker.sampleLink && (
                        <div>
                          <p className="text-gray-400 text-xs font-bold">Sample Video / Presentation / Slides Link:</p>
                          <a
                            href={selectedSpeaker.sampleLink.startsWith('http') ? selectedSpeaker.sampleLink : `https://${selectedSpeaker.sampleLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ted-red hover:underline font-semibold break-all text-sm mt-1 inline-block"
                          >
                            🔗 {selectedSpeaker.sampleLink}
                          </a>
                        </div>
                      )}

                      {/* Policy and Comfort Levels */}
                      {selectedSpeaker.policyComfort && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-800/80 pt-4">
                          <div className="bg-black/30 border border-gray-800 p-3.5 rounded-xl">
                            <span className="text-xs text-gray-400 block font-bold">Recording & Distribution:</span>
                            <span className="text-sm font-semibold text-white block mt-1">{selectedSpeaker.policyComfort}</span>
                          </div>
                          <div className="bg-black/30 border border-gray-800 p-3.5 rounded-xl">
                            <span className="text-xs text-gray-400 block font-bold">Fact Checking & Controversy:</span>
                            <span className="text-sm font-semibold text-white block mt-1">{selectedSpeaker.factCheckingNeed}</span>
                          </div>
                          <div className="bg-black/30 border border-gray-800 p-3.5 rounded-xl">
                            <span className="text-xs text-gray-400 block font-bold">Willingness to Modify:</span>
                            <span className="text-sm font-semibold text-white block mt-1">{selectedSpeaker.willingnessToModify}</span>
                          </div>
                        </div>
                      )}

                      {/* Confirmations List */}
                      <div className="border-t border-gray-800/80 pt-4 space-y-2.5">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Confirmations & Alignments</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-lg border border-gray-800">
                            <span className={selectedSpeaker.soloPresentationConfirmed ? "text-green-500 font-bold text-base" : "text-gray-500 text-base"}>
                              {selectedSpeaker.soloPresentationConfirmed ? "✓" : "✗"}
                            </span>
                            <span className="text-gray-300">Solo Presentation Confirmed</span>
                          </div>
                          <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-lg border border-gray-800">
                            <span className={selectedSpeaker.durationConfirmed ? "text-green-500 font-bold text-base" : "text-gray-500 text-base"}>
                              {selectedSpeaker.durationConfirmed ? "✓" : "✗"}
                            </span>
                            <span className="text-gray-300">
                              Duration Limit Confirmed {selectedSpeaker.durationMinutes ? `(${selectedSpeaker.durationMinutes} min)` : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-lg border border-gray-800">
                            <span className={selectedSpeaker.compliesConfirmed ? "text-green-500 font-bold text-base" : "text-gray-500 text-base"}>
                              {selectedSpeaker.compliesConfirmed ? "✓" : "✗"}
                            </span>
                            <span className="text-gray-300">Complies with TEDx Guidelines</span>
                          </div>
                          <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-lg border border-gray-800">
                            <span className={selectedSpeaker.guidelinesAligned === 'YES' ? "text-green-500 font-bold text-base" : "text-gray-500 text-base"}>
                              {selectedSpeaker.guidelinesAligned === 'YES' ? "✓" : "✗"}
                            </span>
                            <span className="text-gray-300">Guidelines Alignment: {selectedSpeaker.guidelinesAligned || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* How Learned */}
                      {selectedSpeaker.howLearned && (
                        <div className="border-t border-gray-800/80 pt-4">
                          <p className="text-xs text-gray-400 font-bold">How did the speaker learn about TEDxKARE nominations?</p>
                          <p className="text-white font-medium mt-1">{selectedSpeaker.howLearned}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Management */}
              <div className="border-t border-gray-800 pt-6">
                <h4 className="text-ted-red font-bold mb-4">Update Status</h4>
                <div className="flex gap-2 flex-wrap items-center">
                  {['Pending', 'Reviewed', 'Selected', 'Rejected'].map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => handleSpeakerStatusChange(selectedSpeaker._id, statusOption)}
                      disabled={selectedSpeaker.status === statusOption}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        selectedSpeaker.status === statusOption
                          ? statusOption === 'Selected' ? 'bg-green-600 text-white border-green-600' : 'bg-ted-red text-white border-ted-red'
                          : 'btn-outline'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
                {selectedSpeaker.status === 'Selected' && (
                  <p className="text-sm text-green-400 mt-2 font-semibold">
                    ✓ This speaker is officially selected for the event and has been notified!
                  </p>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleSpeakerDelete(selectedSpeaker._id)}
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
