import Notification from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";


/* CREATE NOTIFICATION */

const createNotification = async ({recipient, type, message}) => {

    if (!recipient) {
        return null;
    }
    if (!type || !message?.trim()) {
        return null;
    }
    const notification =
        await Notification.create({
            recipient,
            type,
            message: message.trim(),
        });

    return notification;
};


/* GET ALL NOTIFICATIONS */

const getNotifications = async (userId) => {

    const notifications =
        await Notification.find({
            recipient: userId,
        })
        .sort({
            createdAt: -1,
        });

    return notifications;
};


/* GET UNREAD NOTIFICATIONS */

const getUnreadNotifications = async (userId) => {

    const notifications =
        await Notification.find({
            recipient: userId,
            read: false,
        })
        .sort({
            createdAt: -1,
        });

    return notifications;
};


/* MARK ONE AS READ */

const markNotificationAsRead = async (
    notificationId,
    userId
) => {

    const notification =
        await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                recipient: userId,
            },
            {
                read: true,
            },
            {
                new: true,
            }
        );

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    return notification;
};


/* =========================================================
   MARK ALL AS READ
========================================================= */

const markAllNotificationsAsRead = async (
    userId
) => {

    await Notification.updateMany(
        {
            recipient: userId,
            read: false,
        },
        {
            read: true,
        }
    );

    return true;
};


/* =========================================================
   DELETE NOTIFICATION
========================================================= */

const deleteNotification = async (
    notificationId,
    userId
) => {

    const notification =
        await Notification.findOne({
            _id: notificationId,
            recipient: userId,
        });

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    await Notification.findByIdAndDelete(
        notificationId
    );

    return notification;
};


export {
    createNotification,
    getNotifications,
    getUnreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};