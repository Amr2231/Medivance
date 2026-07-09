"use client";

import { useQuery } from "@tanstack/react-query";
import { getInactiveUsersAction } from "../actions/users.actions";
import type { InactiveUser, User } from "@/lib/types/admin";

// types
type InactiveFilters = {
  page?: number;
  keyword?: string;
  role?: string;
  sort?: "newest" | "oldest";
  created_date?: string;
};

// only used for inactive users
function toInactiveUser(u: User): InactiveUser {
  return {
    id: u.user_id,
    fName: u.first_name,
    lName: u.last_name,
    role: u.role_name,
    created_date: u.created_at,
    status: "Inactive",
  };
}

// fetch inactive users
export function useInactiveUsers(filters?: InactiveFilters) {
  return useQuery({
    queryKey: ["users", "inactive", filters],
    queryFn: async () => {
      const res = await getInactiveUsersAction(filters);
      if (!res.data) throw new Error("Failed to fetch inactive users");
      return {
        data: res.data.map(toInactiveUser),
        total: res.total ?? 0,
        pages: res.pages ?? 1,
        page: res.page ?? 1,
      };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
