import { Router } from "express";
import {deleteNotification, getNotifications, getUnreadNotifications} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getNotifications )
router.get("/unread", getUnreadNotifications)
router.delete("/:notificationId", deleteNotification)

export default router;