const express = require('express');
const { 
  getDiscussions, 
  createDiscussion
} = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getDiscussions)
  .post(createDiscussion);

module.exports = router;
