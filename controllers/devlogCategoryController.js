const devlogCategoryService = require('../services/devlogCategoryService');

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
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create category'
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
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update category'
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
