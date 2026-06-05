const { EcoNewsBlog } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

class EcoNewsBlogService {
  /**
   * Helper to delete an image file from local storage
   */
  _deleteImageFile(imagePath) {
    if (!imagePath) return;
    
    try {
      const filename = path.basename(imagePath);
      const filePath = path.join(__dirname, '../public/uploads', filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Failed to delete file ${imagePath}:`, err.message);
    }
  }

  /**
   * Create a new blog post
   */
  async createBlog(data, file) {
    const { title, author, description, category, date_created } = data;

    // Validation
    if (!title || !title.trim()) {
      const error = new Error('Title is required.');
      error.statusCode = 400;
      throw error;
    }
    if (!author || !author.trim()) {
      const error = new Error('Author is required.');
      error.statusCode = 400;
      throw error;
    }
    if (!description || !description.trim()) {
      const error = new Error('Description is required.');
      error.statusCode = 400;
      throw error;
    }
    if (!category || !category.trim()) {
      const error = new Error('Category is required.');
      error.statusCode = 400;
      throw error;
    }

    let imagePath = null;
    if (file) {
      imagePath = `/uploads/${file.filename}`;
    }

    return await EcoNewsBlog.create({
      title,
      author,
      description,
      category,
      image: imagePath,
      date_created: date_created || new Date()
    });
  }

  /**
   * Get all blogs with pagination, filtering, and searching
   */
  async getAllBlogs(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { category, search, sortBy, sortOrder } = query;
    const whereClause = {};

    // Filter by category
    if (category) {
      whereClause.category = category;
    }

    // Search by title or description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } }
      ];
    }

    // Configure sorting
    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder && sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']);
    } else {
      order.push(['date_created', 'DESC']); // default sort
    }

    const { count, rows } = await EcoNewsBlog.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order
    });

    const totalPages = Math.ceil(count / limit);

    return {
      blogs: rows,
      totalItems: count,
      totalPages,
      currentPage: page,
      limit
    };
  }

  /**
   * Get a single blog by ID
   */
  async getBlogById(id) {
    const blog = await EcoNewsBlog.findByPk(id);

    if (!blog) {
      const error = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    return blog;
  }

  /**
   * Update an existing blog post
   */
  async updateBlog(id, updateData, file) {
    const blog = await EcoNewsBlog.findByPk(id);

    if (!blog) {
      const error = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    const { title, author, description, category, date_created } = updateData;

    // Apply text field updates if provided
    if (title !== undefined) blog.title = title;
    if (author !== undefined) blog.author = author;
    if (description !== undefined) blog.description = description;
    if (category !== undefined) blog.category = category;
    if (date_created !== undefined) blog.date_created = date_created;

    // Handle new image upload
    if (file) {
      // Delete old file if it exists
      if (blog.image) {
        this._deleteImageFile(blog.image);
      }
      blog.image = `/uploads/${file.filename}`;
    }

    await blog.save();
    return blog;
  }

  /**
   * Delete a blog post and its image
   */
  async deleteBlog(id) {
    const blog = await EcoNewsBlog.findByPk(id);

    if (!blog) {
      const error = new Error('Blog post not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete associated image file
    if (blog.image) {
      this._deleteImageFile(blog.image);
    }

    await blog.destroy();
    return true;
  }
}

module.exports = new EcoNewsBlogService();
