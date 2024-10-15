import express from 'express';
import { createLeaveRequest, getLeaveRequests } from '../controllers/leaveController.js';

const router = express.Router();

router.post('/', createLeaveRequest);
router.get('/', getLeaveRequests);

export default router;
