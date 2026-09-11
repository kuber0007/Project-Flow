import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
    getNotifications as getNotificationsService,
    getUnreadNotifications as getUnreadNotificationsService,
    markNotificationAsRead as markNotificationAsReadService,
    markAllNotificationsAsRead as markAllNotificationsAsReadService,
    deleteNotification as deleteNotificationService,
} from "../services/notification.service.js";


/* =========================================================
   GET ALL NOTIFICATIONS
========================================================= */

const getNotifications = asyncHandler(
    async (req, res) => {

        const notifications =
            await getNotificationsService(
                req.user._id
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    notifications,
                    "Notifications fetched successfully"
                )
            );
    }
);


/* =========================================================
   GET UNREAD NOTIFICATIONS
========================================================= */

const getUnreadNotifications = asyncHandler(
    async (req, res) => {

        const notifications =
            await getUnreadNotificationsService(
                req.user._id
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    notifications,
                    "Unread notifications fetched successfully"
                )
            );
    }
);


/* =========================================================
   MARK ONE AS READ
========================================================= */

const markNotificationAsRead = asyncHandler(
    async (req, res) => {

        const {
            notificationId
        } = req.params;

        const notification =
            await markNotificationAsReadService(
                notificationId,
                req.user._id
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    notification,
                    "Notification marked as read"
                )
            );
    }
);


/* =========================================================
   MARK ALL AS READ
========================================================= */

const markAllNotificationsAsRead = asyncHandler(
    async (req, res) => {

        await markAllNotificationsAsReadService(
            req.user._id
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "All notifications marked as read"
                )
            );
    }
);


/* =========================================================
   DELETE NOTIFICATION
========================================================= */

const deleteNotification = asyncHandler(
    async (req, res) => {

        const {
            notificationId
        } = req.params;

        await deleteNotificationService(
            notificationId,
            req.user._id
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Notification deleted successfully"
                )
            );
    }
);


export {
    getNotifications,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};