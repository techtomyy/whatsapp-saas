// Simple stub service for Admin actions; replace with real API calls later

export const userService = {
  async updateUserStatus(userId, action) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, userId, action };
  },
};