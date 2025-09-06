const express = require('express');
const { 
  getProfile, 
  updateProfile,
  deleteProfile
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;
