import { Router } from "express";

import {
    getNotifications,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../controllers/notification.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.use(verifyJWT);


router.get("/",
    getNotifications
);

router.get("/unread",
    getUnreadNotifications
);

router.patch("/read-all",
    markAllNotificationsAsRead
);

router.patch("/:notificationId/read",
    markNotificationAsRead
);

router.delete("/:notificationId",
    deleteNotification
);


export default router;