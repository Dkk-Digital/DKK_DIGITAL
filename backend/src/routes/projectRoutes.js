import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  createProject,
  getClientProjects,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/client/my-projects', protect, getClientProjects);
router.get('/', protect, adminOnly, getAllProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

export default router;
