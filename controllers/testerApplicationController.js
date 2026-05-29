const testerApplicationService = require('../services/testerApplicationService');

// Create a new tester application (Public)
exports.createApplication = async (req, res) => {
  try {
    const application = await testerApplicationService.createApplication(req.body);

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Create application error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
};

// Get all applications (Protected - Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await testerApplicationService.getAllApplications();

    return res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch applications'
    });
  }
};

// Update an application (Protected - Admin)
exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await testerApplicationService.updateApplication(id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update application error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update application'
    });
  }
};

// Delete an application (Protected - Admin)
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await testerApplicationService.deleteApplication(id);

    return res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete application'
    });
  }
};
