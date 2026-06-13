


// =============== Enums ===============
export type Role = "Doctor" | "Receptionist" | "Admin";

export type InactiveStatus = "Inactive" | "Ready for Deletion";


// =============== Base User ===============
export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role_name: Role;
  is_active: number; // 1 = active, 0 = inactive
  created_at: string;
}

// =============== Inactive User ===============
// Backend returns same shape as User — we derive status from is_active
// "Ready for Deletion" is a frontend-only concept tracked separately
export interface InactiveUser {
  id: number;           // maps to user_id
  fName: string;        // maps to first_name
  lName: string;        // maps to last_name
  role: Role;           // maps to role_name
  created_date: string; // maps to created_at
  status: InactiveStatus;
}

// =============== Payloads ===============
// POST /users
export interface AddUserPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  role_name: Role;
}

// PUT /users/:id
export interface UpdateUserPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

// =============== Responses ===============
export interface MutationResponse {
  success?: boolean;
  message: string;
  data?: unknown;
  error?: string;
  field? : string;
}

export interface UsersListResponse {
  success?: boolean;
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: User[];
}

export interface InactiveUsersListResponse {
  success?: boolean;
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: User[];
}