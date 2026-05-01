import Project from '../models/Project.js';
import { notifyProjectStatus } from '../utils/notifications.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, service, budget, startDate, endDate, assignedTo, notes } = req.body;

    const project = await Project.create({
      title,
      description,
      service,
      client: req.user._id,
      budget,
      startDate,
      endDate,
      assignedTo: assignedTo || [],
      notes,
    });

    await project.populate('service').populate('client', 'name email').populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClientProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user._id })
      .populate('service')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { status, search, startDate, endDate, sortBy } = req.query;
    let filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Search filter (full-text search in title and description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDateObj;
      }
    }

    // Build sort object
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy) {
      switch (sortBy) {
        case 'title':
          sort = { title: 1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'recent':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const projects = await Project.find(filter)
      .populate('service')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('service')
      .populate('client', 'name email')
      .populate('assignedTo', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, status, progress, assignedTo, notes } = req.body;

    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, status, progress, assignedTo, notes, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    await project.populate('service').populate('client', 'name email').populate('assignedTo', 'name email');

    // Send notification email to client about status update
    if (status && project.client) {
      notifyProjectStatus(project, project.client).catch((err) => {
        console.error('Failed to send project status notification:', err);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const total = await Project.countDocuments();
    const statuses = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        statuses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
