/**
 * Doctor API client — delegates to shared server fetch layer.
 * Major refactor: single HTTP implementation in @/shared/api/server-client.
 */
export {
  getApiBaseUrl as getApiBase,
  getAuthHeaders,
  serverFetch as doctorFetch,
  serverFetchBlob as doctorFetchBlob,
} from "@/lib/shared/api/server-client";

export { ApiError as DoctorApiError } from "@/lib/shared/api/errors";
