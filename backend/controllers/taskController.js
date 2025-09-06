const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get tasks for a project
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
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
    return next(new ErrorResponse('Not authorized to view tasks for this project', 401));
  }

  // Build query
  const query = { projectId: req.query.projectId };
  
  // Add status filter if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  const tasks = await Task.find(query)
    .populate('assignee', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate('assignee', 'name email');

  if (!task) {
    return next(new ErrorResponse(`No task found with id of ${req.params.id}`, 404));
  }

  // Check if user has access to the project
  const project = await Project.findById(task.projectId);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  if (project.createdBy.toString() !== req.user.id && 
      !project.members.includes(req.user.id)) {
    return next(new ErrorResponse('Not authorized to view this task', 401));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // Check if project exists and user has access
  const project = await Project.findById(req.body.projectId);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check if user is project creator or member
  if (project.createdBy.toString() !== req.user.id && 
      !project.members.includes(req.user.id)) {
    return next(new ErrorResponse('Not authorized to create tasks for this project', 401));
  }

  // Add createdBy to req.body
  req.body.createdBy = req.user.id;

  const task = await Task.create(req.body);

  // Populate the assignee reference
  await task.populate('assignee', 'name email');

  // Create notification if task is assigned to someone
  if (task.assignee && task.assignee.toString() !== req.user.id) {
    await Notification.create({
      userId: task.assignee,
      type: 'task_assigned',
      message: `You have been assigned a new task: ${task.title}`
    });
  }

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`No task found with id of ${req.params.id}`, 404));
  }

  // Check if user has access to the project
  const project = await Project.findById(task.projectId);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  if (project.createdBy.toString() !== req.user.id && 
      !project.members.includes(req.user.id)) {
    return next(new ErrorResponse('Not authorized to update this task', 401));
  }

  // Check if status is changing
  const oldStatus = task.status;
  const newStatus = req.body.status;

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('assignee', 'name email');

  // Create notification if status changed
  if (oldStatus !== newStatus && task.assignee) {
    let notificationType = 'task_created';
    let message = '';

    if (newStatus === 'Done') {
      notificationType = 'task_completed';
      message = `Task completed: ${task.title}`;
    } else if (newStatus === 'In Progress') {
      notificationType = 'project_update';
      message = `Task in progress: ${task.title}`;
    } else {
      notificationType = 'project_update';
      message = `Task updated: ${task.title}`;
    }

    // Don't notify if user is updating their own task
    if (task.assignee.toString() !== req.user.id) {
      await Notification.create({
        userId: task.assignee,
        type: notificationType,
        message: message
      });
    }
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`No task found with id of ${req.params.id}`, 404));
  }

  // Check if user has access to the project
  const project = await Project.findById(task.projectId);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  if (project.createdBy.toString() !== req.user.id && 
      !project.members.includes(req.user.id)) {
    return next(new ErrorResponse('Not authorized to delete this task', 401));
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
