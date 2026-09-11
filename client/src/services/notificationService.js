import apiRequest from "./api";

const getNotifications = async () => {
  const result = await apiRequest("/notifications");

  return result?.data ?? result;
};

const getUnreadNotifications = async () => {
  const result = await apiRequest("/notifications/unread");

  return result?.data ?? result;
};


const markNotificationAsRead = async (
  notificationId
) => {
  const response = await apiRequest(
    `/notifications/${notificationId}/read`,
    {
      method: "PATCH",
    }
  );

  return response?.data ?? response;
};


const markAllNotificationsAsRead = async () => {
  const response = await apiRequest(
    "/notifications/read-all",
    {
      method: "PATCH",
    }
  );

  return response?.data ?? response;
};

export {
  getNotifications,
  getUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
};