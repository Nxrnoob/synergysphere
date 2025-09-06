const express = require('express');
const { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  addMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/members')
  .put(addMember);

module.exports = router;
