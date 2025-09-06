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
const Notification = require('../models/Notification');

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample users
const users = [
  {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    password: "password123",
    profileImage: ""
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    password: "password123",
    profileImage: ""
  },
  {
    name: "David Chen",
    email: "david.chen@example.com",
    password: "password123",
    profileImage: ""
  },
  {
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    password: "password123",
    profileImage: ""
  }
];

// Sample projects
const projects = [
  {
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern UI/UX design"
  },
  {
    name: "Mobile App Development",
    description: "iOS and Android app for customer portal with native features"
  },
  {
    name: "Marketing Campaign Launch",
    description: "Q1 product launch campaign with social media and email marketing"
  }
];

// Sample tasks
const tasks = [
  // Website Redesign tasks
  {
    title: "Create wireframes",
    description: "Design wireframes for homepage and key pages",
    status: "Done"
  },
  {
    title: "Implement frontend",
    description: "Build frontend components based on designs",
    status: "In Progress"
  },
  {
    title: "Conduct user testing",
    description: "Perform usability tests with target audience",
    status: "To-Do"
  },
  // Mobile App Development tasks
  {
    title: "Setup development environment",
    description: "Configure build tools and development server",
    status: "Done"
  },
  {
    title: "Implement authentication",
    description: "Build secure login and signup flows",
    status: "In Progress"
  },
  {
    title: "Add push notifications",
    description: "Integrate push notification service",
    status: "To-Do"
  },
  // Marketing Campaign tasks
  {
    title: "Create social media content",
    description: "Design graphics and write copy for social platforms",
    status: "Done"
  },
  {
    title: "Launch email campaign",
    description: "Send promotional emails to subscriber list",
    status: "In Progress"
  },
  {
    title: "Analyze campaign metrics",
    description: "Review performance and compile report",
    status: "To-Do"
  }
];

// Sample discussions
const discussions = [
  {
    message: "Hey team! I've uploaded the initial wireframes to the shared folder. Please take a look and let me know your thoughts."
  },
  {
    message: "I've started working on the responsive breakpoints. The design looks great on tablet sizes, but we might need to adjust the sidebar on smaller screens."
  },
  {
    message: "Quick update: The API integration is complete and ready for testing. All endpoints are documented in the project wiki."
  },
  {
    message: "Should we schedule a quick review meeting for tomorrow to discuss the mobile app navigation?"
  }
];

const seedMockData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Discussion.deleteMany();
    await Notification.deleteMany();

    console.log('Existing data cleared');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    for (let i = 0; i < users.length; i++) {
      users[i].password = await bcrypt.hash(users[i].password, salt);
    }

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users seeded`);

    // Insert projects with createdBy field
    const projectsWithCreators = projects.map((project, index) => ({
      ...project,
      createdBy: createdUsers[index % createdUsers.length]._id,
      members: [createdUsers[index % createdUsers.length]._id]
    }));

    const createdProjects = await Project.insertMany(projectsWithCreators);
    console.log(`${createdProjects.length} projects seeded`);

    // Update projects with additional members
    // Website Redesign - assign first 3 users
    createdProjects[0].members = [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id];
    await createdProjects[0].save();

    // Mobile App Development - assign last 3 users
    createdProjects[1].members = [createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id];
    await createdProjects[1].save();

    // Marketing Campaign Launch - assign all users
    createdProjects[2].members = createdUsers.map(user => user._id);
    await createdProjects[2].save();

    // Insert tasks
    // Tasks for Website Redesign
    tasks[0].projectId = createdProjects[0]._id;
    tasks[0].assignee = createdUsers[0]._id;
    tasks[1].projectId = createdProjects[0]._id;
    tasks[1].assignee = createdUsers[1]._id;
    tasks[2].projectId = createdProjects[0]._id;
    tasks[2].assignee = createdUsers[2]._id;

    // Tasks for Mobile App Development
    tasks[3].projectId = createdProjects[1]._id;
    tasks[3].assignee = createdUsers[1]._id;
    tasks[4].projectId = createdProjects[1]._id;
    tasks[4].assignee = createdUsers[2]._id;
    tasks[5].projectId = createdProjects[1]._id;
    tasks[5].assignee = createdUsers[3]._id;

    // Tasks for Marketing Campaign
    tasks[6].projectId = createdProjects[2]._id;
    tasks[6].assignee = createdUsers[0]._id;
    tasks[7].projectId = createdProjects[2]._id;
    tasks[7].assignee = createdUsers[1]._id;
    tasks[8].projectId = createdProjects[2]._id;
    tasks[8].assignee = createdUsers[2]._id;

    const createdTasks = await Task.insertMany(tasks);
    console.log(`${createdTasks.length} tasks seeded`);

    // Insert discussions
    discussions[0].projectId = createdProjects[0]._id;
    discussions[0].userId = createdUsers[0]._id;
    discussions[1].projectId = createdProjects[0]._id;
    discussions[1].userId = createdUsers[1]._id;
    discussions[2].projectId = createdProjects[1]._id;
    discussions[2].userId = createdUsers[2]._id;
    discussions[3].projectId = createdProjects[2]._id;
    discussions[3].userId = createdUsers[3]._id;

    const createdDiscussions = await Discussion.insertMany(discussions);
    console.log(`${createdDiscussions.length} discussions seeded`);

    // Insert notifications
    const notifications = [
      {
        userId: createdUsers[0]._id,
        type: "task_assigned",
        message: `You have been assigned a new task: ${tasks[0].title}`
      },
      {
        userId: createdUsers[1]._id,
        type: "task_assigned",
        message: `You have been assigned a new task: ${tasks[1].title}`
      },
      {
        userId: createdUsers[2]._id,
        type: "project_update",
        message: `New discussion in ${createdProjects[0].name}`
      },
      {
        userId: createdUsers[3]._id,
        type: "task_completed",
        message: `Task completed: ${tasks[3].title}`
      }
    ];

    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`${createdNotifications.length} notifications seeded`);

    console.log('Mock data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding mock data:', error);
    process.exit(1);
  }
};

// Run the seeder
seedMockData();
