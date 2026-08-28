import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getNotifications as getNotificationsService,
    getUnreadNotifications as getUnreadNotificationsService,
    deleteNotification as deleteNotificationService
} from "../services/notification.service.js";

// 1. Get Notification
const getNotifications = asyncHandler(async(req,res)=>{
    const notifications = await getNotificationsService("6a7725074b6d32df48ceb3a6")

    return res
    .status(200)
    .json(
        new ApiResponse(200, notifications, "Notifications fetched successfully")
    )
})

// 2. Get unread notifications
const getUnreadNotifications = asyncHandler(async(req,res)=>{
    const notifications = await getUnreadNotificationsService("6a7725074b6d32df48ceb3a6")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, notifications, "Unread Notifications Fetched Successfully"
        )
    )
})

// 3. Delete Notification
const deleteNotification = asyncHandler(async(req,res)=>{
    const {notificationId} = req.params

    await deleteNotificationService(notificationId, "6a7725074b6d32df48ceb3a6")

    return res
    .status(200)
    .json(new ApiResponse(
        200, null, "Notification Deleted Successfully"
    ))
})

export {getNotifications, getUnreadNotifications, deleteNotification}

