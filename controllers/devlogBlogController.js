const devlogBlogService = require('../services/devlogBlogService');
const fs = require('fs');

/**
 * Format database and validation errors into user-friendly responses
 */
const handleSequelizeError = (error, defaultMessage) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return {
      status: 400,
      message: 'A devlog post with this URL slug already exists.'
    };
  }
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map(err => err.message).join(', ');
    return {
      status: 400,
      message: messages
    };
  }
  if (error.name === 'SequelizeDatabaseError' && error.message.includes('Data too long')) {
    return {
      status: 400,
      message: 'The slug or another field is too long for the database limit.'
    };
  }
  return {
    status: error.statusCode || 500,
    message: error.message || defaultMessage
  };
};

/**
 * Helper to delete a file that was just uploaded (used on errors)
 */
const cleanupFile = (file) => {
  if (file && file.path) {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      console.error(`Failed to clean up uploaded file: ${file.path}`, err.message);
    }
  }
};

// Create a new devlog
exports.createBlog = async (req, res) => {
  try {
    const blog = await devlogBlogService.createBlog(req.body, req.file);

    return res.status(201).json({
      success: true,
      message: 'Devlog post created successfully',
      data: blog
    });
  } catch (error) {
    // If the creation failed, delete the uploaded file
    cleanupFile(req.file);
    
    console.error('Create devlog error:', error);
    const errRes = handleSequelizeError(error, 'Failed to create devlog post');
    return res.status(errRes.status).json({
      success: false,
      message: errRes.message
    });
  }
};

// Get all devlogs (Public)
exports.getAllBlogs = async (req, res) => {
  try {
    const result = await devlogBlogService.getAllBlogs(req.query);

    return res.status(200).json({
      success: true,
      data: result.blogs,
      pagination: {
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit
      }
    });
  } catch (error) {
    console.error('Get all devlogs error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch devlog posts'
    });
  }
};

// Get single devlog by ID (Public)
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await devlogBlogService.getBlogById(id);

    return res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get devlog by ID error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch devlog post'
    });
  }
};

// Get single devlog by slug (Public)
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await devlogBlogService.getBlogBySlug(slug);

    return res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get devlog by slug error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch devlog post'
    });
  }
};

// Update an existing devlog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await devlogBlogService.updateBlog(id, req.body, req.file);

    return res.status(200).json({
      success: true,
      message: 'Devlog post updated successfully',
      data: blog
    });
  } catch (error) {
    // If the update failed, delete the newly uploaded file
    cleanupFile(req.file);

    console.error('Update devlog error:', error);
    const errRes = handleSequelizeError(error, 'Failed to update devlog post');
    return res.status(errRes.status).json({
      success: false,
      message: errRes.message
    });
  }
};

// Delete a devlog post
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await devlogBlogService.deleteBlog(id);

    return res.status(200).json({
      success: true,
      message: 'Devlog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete devlog error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete devlog post'
    });
  }
};
