import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/shared/api/server-client";

// Type for a doctor
type DoctorListItem = {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
};

// GET /api/receptionist/doctors
export async function GET() {
  try {
    // get doctors
    const res = await serverFetch<{
      success: boolean;
      data: DoctorListItem[];
    }>("/users?status=active&role=Doctor&limit=100");
    return NextResponse.json(res.data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
