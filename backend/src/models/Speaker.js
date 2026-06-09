import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema(
  {
    // --- SECTION 1: Speaker Profile ---
    name: { type: String, required: true, trim: true, minlength: 2 },
    selfNomination: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    linkedin: { type: String, required: true, trim: true },
    additionalLinks: { type: String, trim: true },
    firstTedxTalk: { type: String, required: true, trim: true }, // YES or NO
    hasDisability: { type: String, required: true, trim: true }, // YES, NO, or PREFER_NOT_TO_SAY
    disabilityDetails: { type: String, trim: true },
    
    // --- SECTION 2: Nominator Information (Only if not self-nominated) ---
    nominatorName: { type: String, trim: true },
    nominatorEmail: { type: String, trim: true, lowercase: true },
    nominatorPhone: { type: String, trim: true },
    nominatorLocation: { type: String, trim: true }, // City, State/Province, Country
    nominatorOrganization: { type: String, trim: true },
    nominatorRelationship: { type: String, trim: true },
    
    // --- IDEA 1 (Required) ---
    whySpeak1: { type: String, trim: true },
    idea1Title: { type: String, required: true, trim: true },
    idea1Description: { type: String, required: true, trim: true },
    idea1Domain: { type: String, required: true, trim: true },
    idea1WorthSpreading: { type: String, required: true, trim: true },
    idea1Relevance: { type: String, required: true, trim: true },
    idea1Challenge: { type: String, required: true, trim: true },
    idea1Impact: { type: String, required: true, trim: true },
    idea1ImpactFile: { type: String }, // Base64 document
    idea1ImpactFileName: { type: String },
    idea1Evidence: { type: String, required: true, trim: true },
    idea1EvidenceFile: { type: String }, // Base64 document
    idea1EvidenceFileName: { type: String },
    idea1Scalability: { type: String, required: true, trim: true },
    idea1LivedExperience: { type: String, required: true, trim: true }, // YES or NO
    idea1LivedExperienceDesc: { type: String, trim: true },
    idea1Props: { type: String, required: true, trim: true }, // YES or NO
    idea1PropsDetails: { type: String, trim: true },
    idea1PresentedBefore: { type: String, required: true, trim: true }, // YES or NO
    idea1PresentedBeforeDetails: { type: String, trim: true },
    idea1PresentedBeforeFile: { type: String }, // Base64 document
    idea1PresentedBeforeFileName: { type: String },
    idea1Articles: { type: String, required: true, trim: true },
    idea1File: { type: String }, // Base64 document
    idea1FileName: { type: String },
    idea1NewSurprising: { type: String, required: true, trim: true },
    idea1Audience: { type: String, trim: true },
    idea1Comments: { type: String, trim: true },

    // --- SECTION 2: IDEA 2 (Mandatory) ---
    whySpeak2: { type: String, trim: true },
    idea2Title: { type: String, required: true, trim: true },
    idea2Description: { type: String, required: true, trim: true },
    idea2Domain: { type: String, required: true, trim: true },
    idea2WorthSpreading: { type: String, required: true, trim: true },
    idea2Relevance: { type: String, required: true, trim: true },
    idea2Challenge: { type: String, required: true, trim: true },
    idea2Impact: { type: String, required: true, trim: true },
    idea2ImpactFile: { type: String },
    idea2ImpactFileName: { type: String },
    idea2Evidence: { type: String, required: true, trim: true },
    idea2EvidenceFile: { type: String },
    idea2EvidenceFileName: { type: String },
    idea2Scalability: { type: String, required: true, trim: true },
    idea2LivedExperience: { type: String, required: true, trim: true },
    idea2LivedExperienceDesc: { type: String, trim: true },
    idea2Props: { type: String, required: true, trim: true },
    idea2PropsDetails: { type: String, trim: true },
    idea2PresentedBefore: { type: String, required: true, trim: true },
    idea2PresentedBeforeDetails: { type: String, trim: true },
    idea2PresentedBeforeFile: { type: String },
    idea2PresentedBeforeFileName: { type: String },
    idea2Articles: { type: String, required: true, trim: true },
    idea2File: { type: String }, // Base64 document
    idea2FileName: { type: String },
    idea2NewSurprising: { type: String, required: true, trim: true },
    idea2Audience: { type: String, trim: true },
    idea2Comments: { type: String, trim: true },

    // --- SECTION 3: IDEA 3 (Mandatory) ---
    whySpeak3: { type: String, trim: true },
    idea3Title: { type: String, required: true, trim: true },
    idea3Description: { type: String, required: true, trim: true },
    idea3Domain: { type: String, required: true, trim: true },
    idea3WorthSpreading: { type: String, required: true, trim: true },
    idea3Relevance: { type: String, required: true, trim: true },
    idea3Challenge: { type: String, required: true, trim: true },
    idea3Impact: { type: String, required: true, trim: true },
    idea3ImpactFile: { type: String },
    idea3ImpactFileName: { type: String },
    idea3Evidence: { type: String, required: true, trim: true },
    idea3EvidenceFile: { type: String },
    idea3EvidenceFileName: { type: String },
    idea3Scalability: { type: String, required: true, trim: true },
    idea3LivedExperience: { type: String, required: true, trim: true },
    idea3LivedExperienceDesc: { type: String, trim: true },
    idea3Props: { type: String, required: true, trim: true },
    idea3PropsDetails: { type: String, trim: true },
    idea3PresentedBefore: { type: String, required: true, trim: true },
    idea3PresentedBeforeDetails: { type: String, trim: true },
    idea3PresentedBeforeFile: { type: String },
    idea3PresentedBeforeFileName: { type: String },
    idea3Articles: { type: String, required: true, trim: true },
    idea3File: { type: String }, // Base64 document
    idea3FileName: { type: String },
    idea3NewSurprising: { type: String, required: true, trim: true },
    idea3Audience: { type: String, trim: true },
    idea3Comments: { type: String, trim: true },

    // --- SECTION 4: Proposed Talk & Confirmations ---
    proposedTitle: { type: String, required: true, trim: true },
    proposedDescription: { type: String, required: true, trim: true },
    proposedQualifications: { type: String, trim: true },
    policyComfort: { type: String, required: true, trim: true },
    factCheckingNeed: { type: String, required: true, trim: true },
    willingnessToModify: { type: String, required: true, trim: true },
    soloPresentationConfirmed: { type: Boolean, required: true },
    durationConfirmed: { type: Boolean, required: true },
    compliesConfirmed: { type: Boolean, required: true },
    guidelinesAligned: { type: String, required: true, trim: true }, // YES or NO
    hasAdditionalIdeas: { type: String, required: true, trim: true }, // YES or NO
    howLearned: { type: String, required: true, trim: true },

    // --- Backward compatibility fields (Optional in schema) ---
    age: { type: Number },
    details: { type: String, trim: true },
    background: { type: String, trim: true },
    whyApply: { type: String, trim: true },
    idea1DomainLegacy: { type: String, trim: true },
    idea1DescriptionLegacy: { type: String, trim: true },
    idea1Sentence: { type: String, trim: true },
    idea2DomainLegacy: { type: String, trim: true },
    idea2DescriptionLegacy: { type: String, trim: true },
    idea2Sentence: { type: String, trim: true },
    idea3DomainLegacy: { type: String, trim: true },
    idea3DescriptionLegacy: { type: String, trim: true },
    idea3Sentence: { type: String, trim: true },
    title: { type: String, trim: true },
    abstract: { type: String, trim: true },
    durationMinutes: { type: Number, default: 10 },
    bio: { type: String, trim: true },
    sampleLink: { type: String, trim: true },
    
    // --- System Status Fields ---
    status: { type: String, enum: ['Pending', 'Reviewed', 'Selected', 'Rejected'], default: 'Pending' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

speakerSchema.index({ email: 1 });
speakerSchema.index({ status: 1 });

const Speaker = mongoose.model('Speaker', speakerSchema);

export default Speaker;
