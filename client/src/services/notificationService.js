import apiRequest from "./api";

const getNotifications = async () => {
  const result = await apiRequest("/notifications");

  return result?.data ?? result;
};

const getUnreadNotifications = async () => {
  const result = await apiRequest("/notifications/unread");

  return result?.data ?? result;
};

export {
  getNotifications,
  getUnreadNotifications,
};