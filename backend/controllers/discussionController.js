const Discussion = require('../models/Discussion');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get discussions for a project
// @route   GET /api/discussions
// @access  Private
exports.getDiscussions = asyncHandler(async (req, res, next) => {
  // Check if project ID is provided
  if (!req.query.projectId) {
    return next(new ErrorResponse('Please provide a project ID', 400));
  }

  // Check if project exists and user has access
  const project = await Project.findById(req.query.projectId);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if user is project creator or member
  if (project.createdBy.toString() !== req.user.id && 
      !project.members.includes(req.user.id)) {
    return next(new ErrorResponse('Not authorized to view discussions for this project', 401));
  }

  const discussions = await Discussion.find({ projectId: req.query.projectId })
    .populate('userId', 'name email profileImage')
    .sort({ timestamp: 1 });

  res.status(200).json({
    success: true,
    count: discussions.length,
    data: discussions
  });
});

// @desc    Create new discussion message
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = asyncHandler(async (req, res, next) => {
  // Check if project exists and user has access
  const project = await Project.findById(req.body.projectId);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if user is project creator or member
  if (project.createdBy.toString() !== req.user.id && 
      !project.members.includes(req.user.id)) {
    return next(new ErrorResponse('Not authorized to create discussions for this project', 401));
  }

  // Add user ID to req.body
  req.body.userId = req.user.id;

  // Use exact timestamp
  req.body.timestamp = new Date();

  const discussion = await Discussion.create(req.body);

  // Populate the user reference
  await discussion.populate('userId', 'name email profileImage');

  res.status(201).json({
    success: true,
    data: discussion
  });
});
