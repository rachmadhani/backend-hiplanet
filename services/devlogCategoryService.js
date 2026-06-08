const { DevlogCategory } = require('../models');

class DevlogCategoryService {
  async createCategory(data) {
    const { name, slug, description } = data;
    
    // Validation
    if (!name || !name.trim()) {
      const error = new Error('Name is required.');
      error.statusCode = 400;
      throw error;
    }
    if (!slug || !slug.trim()) {
      const error = new Error('Slug is required.');
      error.statusCode = 400;
      throw error;
    }

    return await DevlogCategory.create({ name, slug, description });
  }

  async getAllCategories() {
    return await DevlogCategory.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async getCategoryById(id) {
    const category = await DevlogCategory.findByPk(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  async updateCategory(id, updateData) {
    const category = await DevlogCategory.findByPk(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    const { name, slug, description } = updateData;
    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined) category.description = description;

    await category.save();
    return category;
  }

  async deleteCategory(id) {
    const category = await DevlogCategory.findByPk(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    await category.destroy();
    return true;
  }
}

module.exports = new DevlogCategoryService();
