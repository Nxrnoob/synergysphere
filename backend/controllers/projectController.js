const Project = require('../models/Project');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({
    $or: [
      { createdBy: req.user.id },
      { members: req.user.id }
    ]
  }).populate('createdBy', 'name email').populate('members', 'name email');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('members', 'name email');

  if (!project) {
    return next(new ErrorResponse(`No project found with id of ${req.params.id}`, 404));
  }

  // Check if user is project creator or member
  if (project.createdBy.toString() !== req.user.id && 
      !project.members.includes(req.user.id)) {
    return next(new ErrorResponse('Not authorized to view this project', 401));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;
  
  // Add user as member by default
  req.body.members = [req.user.id];

  const project = await Project.create(req.body);

  // Populate the references
  await project.populate('createdBy', 'name email');
  await project.populate('members', 'name email');

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`No project found with id of ${req.params.id}`, 404));
  }

  // Check if user is project creator
  if (project.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this project', 401));
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('createdBy', 'name email').populate('members', 'name email');

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
 const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`No project found with id of ${req.params.id}`, 404));
  }

  // Check if user is project creator
  if (project.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this project', 401));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private
exports.addMember = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`No project found with id of ${req.params.id}`, 404));
  }

  // Check if user is project creator
  if (project.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to add members to this project', 401));
  }

  // Check if user exists
  const user = await User.findById(req.body.userId);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check if user is already a member
  if (project.members.includes(req.body.userId)) {
    return next(new ErrorResponse('User is already a member of this project', 400));
  }

  // Add member
  project.members.push(req.body.userId);
  await project.save();

  // Populate the references
  await project.populate('createdBy', 'name email');
  await project.populate('members', 'name email');

  res.status(200).json({
    success: true,
    data: project
  });
});
