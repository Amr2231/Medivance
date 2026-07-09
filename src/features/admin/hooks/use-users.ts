"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveUsersAction } from "../actions/users.actions";

// types
type Filters = {
  keyword?: string;
  role?: string;
  created_date?: string;
  sort?: "newest" | "oldest";
  page?: number;
};

// use users
export function useUsers(filters?: Filters) {
  return useQuery({
    queryKey: [
      "users",
      {
        keyword: filters?.keyword,
        role: filters?.role,
        created_date: filters?.created_date,
        sort: filters?.sort,
        page: filters?.page,
      },
    ],
    queryFn: async () => {
      // fetch
      const res = await getActiveUsersAction(filters);
      return {
        data: res.data ?? [],
        total: res.total ?? 0,
        pages: res.pages ?? 1,
        page: res.page ?? 1,
      };
    },
    placeholderData: (prev) => prev,
    staleTime: 0,
  });
}
