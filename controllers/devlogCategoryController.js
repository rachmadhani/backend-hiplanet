const devlogCategoryService = require('../services/devlogCategoryService');

/**
 * Format database and validation errors into user-friendly responses
 */
const handleSequelizeError = (error, defaultMessage) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return {
      status: 400,
      message: 'A category with this URL slug already exists.'
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

exports.createCategory = async (req, res) => {
  try {
    const category = await devlogCategoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    const errRes = handleSequelizeError(error, 'Failed to create category');
    return res.status(errRes.status).json({
      success: false,
      message: errRes.message
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await devlogCategoryService.getAllCategories();
    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch categories'
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await devlogCategoryService.getCategoryById(id);
    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch category'
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await devlogCategoryService.updateCategory(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    const errRes = handleSequelizeError(error, 'Failed to update category');
    return res.status(errRes.status).json({
      success: false,
      message: errRes.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await devlogCategoryService.deleteCategory(id);
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete category'
    });
  }
};
