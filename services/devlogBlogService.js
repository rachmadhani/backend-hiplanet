const { DevlogBlog, DevlogCategory } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

class DevlogBlogService {
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
   * Create a new devlog post
   */
  async createBlog(data, file) {
    const { title, author, description, category_id, slug, date_created } = data;

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
    if (!category_id) {
      const error = new Error('Category ID is required.');
      error.statusCode = 400;
      throw error;
    }
    if (!slug || !slug.trim()) {
      const error = new Error('Slug is required.');
      error.statusCode = 400;
      throw error;
    }

    let imagePath = null;
    if (file) {
      imagePath = `/uploads/${file.filename}`;
    }

    return await DevlogBlog.create({
      title,
      author,
      description,
      category_id,
      slug,
      image: imagePath,
      date_created: date_created || new Date()
    });
  }

  /**
   * Get all devlogs with pagination, filtering, and searching
   */
  async getAllBlogs(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { category_id, search, sortBy, sortOrder } = query;
    const whereClause = {};

    // Filter by category_id
    if (category_id) {
      whereClause.category_id = category_id;
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

    const { count, rows } = await DevlogBlog.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
      include: [
        {
          model: DevlogCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
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
   * Get a single devlog by ID
   */
  async getBlogById(id) {
    const blog = await DevlogBlog.findByPk(id, {
      include: [
        {
          model: DevlogCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!blog) {
      const error = new Error('Devlog post not found');
      error.statusCode = 404;
      throw error;
    }

    return blog;
  }

  /**
   * Get a single devlog by slug
   */
  async getBlogBySlug(slug) {
    const blog = await DevlogBlog.findOne({ 
      where: { slug },
      include: [
        {
          model: DevlogCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!blog) {
      const error = new Error('Devlog post not found');
      error.statusCode = 404;
      throw error;
    }

    return blog;
  }

  /**
   * Update an existing devlog post
   */
  async updateBlog(id, updateData, file) {
    const blog = await DevlogBlog.findByPk(id);

    if (!blog) {
      const error = new Error('Devlog post not found');
      error.statusCode = 404;
      throw error;
    }

    const { title, author, description, category_id, slug, date_created } = updateData;

    // Apply text field updates if provided
    if (title !== undefined) blog.title = title;
    if (author !== undefined) blog.author = author;
    if (description !== undefined) blog.description = description;
    if (category_id !== undefined) blog.category_id = category_id;
    if (slug !== undefined) blog.slug = slug;
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
   * Delete a devlog post and its image
   */
  async deleteBlog(id) {
    const blog = await DevlogBlog.findByPk(id);

    if (!blog) {
      const error = new Error('Devlog post not found');
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

module.exports = new DevlogBlogService();
