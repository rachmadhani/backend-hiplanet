const { TesterApplication } = require('../models');
const emailService = require('./emailService');

class TesterApplicationService {
  async createApplication(data) {
    const { email, name, platform, why, country, nda } = data;

    // Extra validation in service layer
    if (!email || !email.includes('@')) {
      const error = new Error('Please enter a valid email address.');
      error.statusCode = 400;
      throw error;
    }
    if (!name || !name.trim()) {
      const error = new Error('Please enter your name or handle.');
      error.statusCode = 400;
      throw error;
    }
    if (!platform) {
      const error = new Error('Please choose a platform.');
      error.statusCode = 400;
      throw error;
    }
    if (!why || !why.trim()) {
      const error = new Error('Please tell us why you want to test.');
      error.statusCode = 400;
      throw error;
    }
    if (nda !== true && nda !== 'true') {
      const error = new Error('You must agree to keep gameplay confidential.');
      error.statusCode = 400;
      throw error;
    }

    return await TesterApplication.create({
      email,
      name,
      platform,
      why,
      country: country || null,
      nda: true,
      status: 'pending'
    });
  }

  async getAllApplications(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await TesterApplication.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    return {
      totalItems: count,
      applications: rows,
      totalPages,
      currentPage: page,
      limit
    };
  }

  async updateApplication(id, updateData) {
    const application = await TesterApplication.findByPk(id);

    if (!application) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    const previousStatus = application.status;
    const { email, name, platform, why, country, nda, status, build_platform } = updateData;

    if (email !== undefined) application.email = email;
    if (name !== undefined) application.name = name;
    if (platform !== undefined) application.platform = platform;
    if (why !== undefined) application.why = why;
    if (country !== undefined) application.country = country;
    if (nda !== undefined) application.nda = nda;
    if (status !== undefined) application.status = status;
    if (build_platform !== undefined) application.build_platform = build_platform;

    await application.save();

    // Send welcome email if status transitions to 'approved'
    if (application.status === 'approved' && previousStatus !== 'approved' && application.build_platform !== null) {
      emailService.sendWelcomeEmail(application.email, application.name, application.build_platform)
        .catch(err => console.error('Failed to send welcome email in background:', err.message));
    }

    return application;
  }

  async deleteApplication(id) {
    const application = await TesterApplication.findByPk(id);

    if (!application) {
      const error = new Error('Application not found');
      error.statusCode = 404;
      throw error;
    }

    await application.destroy();
    return true;
  }
}

module.exports = new TesterApplicationService();
