import Project from '../models/Project.js';

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
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const projects = await Project.find(filter)
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
