import client from './client.js';

export async function getNotifications() {
  const response = await client.get('/api/notifications');
  return response.data?.data?.notifications || [];
}

export async function markNotificationAsRead(id) {
  const response = await client.patch(`/api/notifications/${id}/read`);
  return response.data?.data?.notification;
}

export async function markAllNotificationsAsRead() {
  const response = await client.patch('/api/notifications/read-all');
  return response.data;
}
