import Notification from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";

// 1. Get Notification
const getNotifications = async (userId) => {
    const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 })
    return notifications
}

// 2. Get Unread Notification
const getUnreadNotifications = async (userId) => {
    const notifications = await Notification.find({
        recipient: userId,
        read: false,
    }).sort({ createdAt: -1 });

    return notifications;
};

// 3. Delete Notification
const deleteNotification = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId
    })

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    await Notification.findByIdAndDelete(notificationId);

    return notification;
}

export { getNotifications, getUnreadNotifications, deleteNotification }; 