// A simple CUID generator (for demonstration purposes)
// In a real app, you might want a more robust library
export const createId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `c${timestamp}${random}`;
};
