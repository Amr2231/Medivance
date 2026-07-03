export const notificationKeys = {
  all: ["notifications"] as const,
  preview: () => [...notificationKeys.all, "preview"] as const,
  list: (filters: Record<string, unknown>) =>
    [...notificationKeys.all, "list", filters] as const,
};
