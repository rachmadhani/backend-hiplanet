const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const testerApplicationController = require('../controllers/testerApplicationController');
const ecoNewsBlogController = require('../controllers/ecoNewsBlogController');
const devlogCategoryController = require('../controllers/devlogCategoryController');
const devlogBlogController = require('../controllers/devlogBlogController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadImage } = require('../middlewares/uploadMiddleware');

// Healthcheck endpoint
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running',
    timestamp: new Date()
  });
});

// Test connection endpoint
router.get('/test', async (req, res) => {
  try {
    const { sequelize } = require('../models');
    // Run a simple query to verify connection
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    res.status(200).json({
      success: true,
      message: 'Database connection test successful',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error.message
    });
  }
});

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// User routes (Protected)
router.get('/users', protect, userController.getAllUsers);
router.post('/users', protect, userController.createUser);

// Tester Application routes
router.post('/tester-applications', testerApplicationController.createApplication); // Public
router.get('/tester-applications', protect, testerApplicationController.getAllApplications); // Protected
router.put('/tester-applications/:id', protect, testerApplicationController.updateApplication); // Protected
router.delete('/tester-applications/:id', protect, testerApplicationController.deleteApplication); // Protected

// EcoNews Blog routes
router.get('/econews-blogs', ecoNewsBlogController.getAllBlogs); // Public
router.get('/econews-blogs/slug/:slug', ecoNewsBlogController.getBlogBySlug); // Public
router.get('/econews-blogs/:id', ecoNewsBlogController.getBlogById); // Public
router.post('/econews-blogs', protect, uploadImage('image'), ecoNewsBlogController.createBlog); // Protected
router.put('/econews-blogs/:id', protect, uploadImage('image'), ecoNewsBlogController.updateBlog); // Protected
router.delete('/econews-blogs/:id', protect, ecoNewsBlogController.deleteBlog); // Protected

// Devlog Category routes
router.get('/devlog-categories', devlogCategoryController.getAllCategories); // Public
router.get('/devlog-categories/:id', devlogCategoryController.getCategoryById); // Public
router.post('/devlog-categories', protect, devlogCategoryController.createCategory); // Protected
router.put('/devlog-categories/:id', protect, devlogCategoryController.updateCategory); // Protected
router.delete('/devlog-categories/:id', protect, devlogCategoryController.deleteCategory); // Protected

// Devlog Blog routes
router.get('/devlog-blogs', devlogBlogController.getAllBlogs); // Public
router.get('/devlog-blogs/slug/:slug', devlogBlogController.getBlogBySlug); // Public
router.get('/devlog-blogs/:id', devlogBlogController.getBlogById); // Public
router.post('/devlog-blogs', protect, uploadImage('image'), devlogBlogController.createBlog); // Protected
router.put('/devlog-blogs/:id', protect, uploadImage('image'), devlogBlogController.updateBlog); // Protected
router.delete('/devlog-blogs/:id', protect, devlogBlogController.deleteBlog); // Protected

module.exports = router;
