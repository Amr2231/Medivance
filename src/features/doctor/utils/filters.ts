export type SortOrder = "newest" | "oldest";

export type ActivePatientsQuery = {
  keyword?: string;
  study_type?: string;
  report_status?: string;
  date?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
};

export type HistoricalPatientsQuery = {
  keyword?: string;
  study_type?: string;
  date?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
  // report_status?: string;
};

export function buildSearchParams(
  query: Record<string, string | number | undefined>,
  defaults?: { page?: number; limit?: number },
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    if (typeof value === "string" && !value.trim()) continue;
    params.set(key, String(value));
  }

  params.set("page", String(query.page ?? defaults?.page ?? 1));
  params.set("limit", String(query.limit ?? defaults?.limit ?? 10));

  return params;
}

export function normalizeActivePatientsQuery(
  filters: ActivePatientsQuery = {},
): ActivePatientsQuery {
  return {
    keyword:
      typeof filters.keyword === "string" ? filters.keyword.trim() : undefined,
    study_type:
      typeof filters.study_type === "string" ? filters.study_type : undefined,
    report_status:
      typeof filters.report_status === "string"
        ? filters.report_status
        : undefined,
    date: typeof filters.date === "string" ? filters.date : undefined,
    sort: filters.sort,
    page: Number(filters.page ?? 1),
    limit: Number(filters.limit ?? 10),
  };
}

export function normalizeHistoricalPatientsQuery(
  filters: HistoricalPatientsQuery = {},
): HistoricalPatientsQuery {
  return {
    keyword:
      typeof filters.keyword === "string" ? filters.keyword.trim() : undefined,
    study_type:
      typeof filters.study_type === "string" ? filters.study_type : undefined,
    date: typeof filters.date === "string" ? filters.date : undefined,
    sort: filters.sort,
    page: Number(filters.page ?? 1),
    limit: Number(filters.limit ?? 10),
  };
}
