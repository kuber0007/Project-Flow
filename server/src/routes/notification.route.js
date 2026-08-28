import { Router } from "express";
import {deleteNotification, getNotifications, getUnreadNotifications} from "../controllers/notification.controller.js";

const router = Router();

router.get("/", getNotifications )
router.get("/unread", getUnreadNotifications)
router.delete("/:notificationId", deleteNotification)

export default router;