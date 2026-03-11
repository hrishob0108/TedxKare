import Applicant from '../models/Applicant.js';
import axios from 'axios';
import { validationResult } from 'express-validator';

// ==================== GET ALL APPLICANTS ====================
// Admin only: Retrieve all applicants with optional filtering
export const getAllApplicants = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.admin) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in as an admin to access applications. Please log in first.'
      });
    }

    const { domain, status, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter object
    let filter = {};

    if (domain && domain !== 'All') {
      filter.firstPreference = domain;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query
    const applicants = await Applicant.find(filter).sort(sortObj).lean();

    res.json({
      success: true,
      count: applicants.length,
      data: applicants,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET SINGLE APPLICANT ====================
// Admin only: Retrieve details of a specific applicant
export const getApplicantById = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const applicant = await Applicant.findById(req.params.id);

    if (!applicant) {
      return res.status(404).json({
        error: 'Applicant not found',
        message: 'The applicant with this ID could not be found. It may have been deleted.'
      });
    }

    res.json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CREATE NEW APPLICATION ====================
// Public: Submit a new application
export const createApplication = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    // Prevent duplicate submissions from same email
    const existingApplicant = await Applicant.findOne({ email: req.body.email });
    if (existingApplicant) {
      return res.status(409).json({
        error: 'An application with this email already exists',
        message: 'You have already submitted an application with this email address. Please use a different email or contact support if you need to update your application.',
      });
    }

    // Prevent spam from same IP (max 10 applications per IP per day)
    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '';

    if (ipAddress) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentApplicationsFromIP = await Applicant.countDocuments({
        ipAddress,
        createdAt: { $gte: oneDayAgo },
      });

      if (recentApplicationsFromIP >= 10) {
        return res.status(429).json({
          error: 'Too many applications from your network',
          message: 'We have received too many applications from your IP address. Please try again later.',
        });
      }
    }

    // Create new applicant
    const applicantData = {
      ...req.body,
      ipAddress,
    };

    const applicant = new Applicant(applicantData);
    await applicant.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: applicant._id,
        name: applicant.name,
        email: applicant.email,
      },
    });

    // Log submission (optional)
    console.log(`✓ New application received from ${applicant.name} (${applicant.email})`);
  } catch (error) {
    next(error);
  }
};

// ==================== UPDATE APPLICANT STATUS ====================
// Admin only: Update the status of an application
export const updateApplicantStatus = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status, email } = req.body;
    console.log(req.body);
    // Validate status
    if (status == "Rejected") {
      try {
        axios.post("https://7feej0sxm3.execute-api.eu-north-1.amazonaws.com/default/mail_sender",
          {
            config: {
              email: "hrishobp@gmail.com",
              pass: "lerz fhwj rsqx ogbp",
              from: "'TEDxKARE' <hrishobp@gmail.com>",
            },
            to: email,
            subject: "Your application has been rejected",
            body: "Your application has been rejected"
          }).then((res) => { console.log(res.data) }).catch((err) => { console.log("error") })
      }
      catch (error) {
        console.log("jo");
      }
    }
    else {
      try {
        axios.post("https://7feej0sxm3.execute-api.eu-north-1.amazonaws.com/default/mail_sender",
          {
            config: {
              email: "hrishobp@gmail.com",
              pass: "lerz fhwj rsqx ogbp",
              from: "'TEDxKARE' <hrishobp@gmail.com>",
            },
            to: email,
            subject: "Your application has been accepted",
            body: "Your application has been accepted"
          }).then((res) => { console.log(res.data) }).catch((err) => { console.log("error") })
      }
      catch (error) {
        console.log("jo");
      }
    }
    const validStatuses = ['Pending', 'Shortlisted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status provided',
        message: `Status must be one of: ${validStatuses.join(', ')}. You provided: "${status}"`,
      });
    }

    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: applicant,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== DELETE APPLICANT ====================
// Admin only: Delete an applicant record
export const deleteApplicant = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in as an admin to delete applications.'
      });
    }

    const applicant = await Applicant.findByIdAndDelete(req.params.id);

    if (!applicant) {
      return res.status(404).json({
        error: 'Applicant not found',
        message: `Cannot delete - applicant with ID ${req.params.id} does not exist or has already been deleted.`
      });
    }

    res.json({
      success: true,
      message: 'Applicant deleted successfully',
      data: applicant,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== GET STATISTICS ====================
// Admin only: Get application statistics
export const getStatistics = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in as an admin to view statistics. Please log in first.'
      });
    }

    const totalApplications = await Applicant.countDocuments();
    const pendingApplications = await Applicant.countDocuments({ status: 'Pending' });
    const shortlistedApplications = await Applicant.countDocuments({ status: 'Shortlisted' });
    const rejectedApplications = await Applicant.countDocuments({ status: 'Rejected' });

    // Get applications by domain
    const byDomain = await Applicant.aggregate([
      {
        $group: {
          _id: '$firstPreference',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalApplications,
        byStatus: {
          pending: pendingApplications,
          shortlisted: shortlistedApplications,
          rejected: rejectedApplications,
        },
        byDomain: byDomain.map((d) => ({
          domain: d._id,
          count: d.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllApplicants,
  getApplicantById,
  createApplication,
  updateApplicantStatus,
  deleteApplicant,
  getStatistics,
};
