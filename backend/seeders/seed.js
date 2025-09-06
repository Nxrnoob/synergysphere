const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Load models
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Discussion = require('../models/Discussion');

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    profileImage: '',
  },
];

const projects = [
  {
    name: 'Website Redesign',
    description: 'Redesign company website with modern UI/UX',
  },
];

const tasks = [
  {
    title: 'Create wireframes',
    description: 'Design wireframes for homepage and key pages',
    status: 'In Progress',
  },
  {
    title: 'Implement frontend',
    description: 'Build frontend components based on designs',
    status: 'To-Do',
  },
];

const discussions = [
  {
    message: 'Let\'s discuss the project requirements and timeline.',
  },
];

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Discussion.deleteMany();

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    users[0].password = await bcrypt.hash(users[0].password, salt);

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('Users seeded');

    // Insert projects
    projects[0].createdBy = createdUsers[0]._id;
    projects[0].members = [createdUsers[0]._id];
    const createdProjects = await Project.insertMany(projects);
    console.log('Projects seeded');

    // Insert tasks
    tasks[0].projectId = createdProjects[0]._id;
    tasks[0].assignee = createdUsers[0]._id;
    tasks[1].projectId = createdProjects[0]._id;
    tasks[1].assignee = createdUsers[0]._id;
    await Task.insertMany(tasks);
    console.log('Tasks seeded');

    // Insert discussions
    discussions[0].projectId = createdProjects[0]._id;
    discussions[0].userId = createdUsers[0]._id;
    await Discussion.insertMany(discussions);
    console.log('Discussions seeded');

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Discussion.deleteMany();

    console.log('Data deleted successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  seedData();
}
