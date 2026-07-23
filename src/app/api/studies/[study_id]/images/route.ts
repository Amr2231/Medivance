import { NextRequest, NextResponse } from "next/server";
import { getServerApiUrl } from "@/lib/shared/config/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  BackendCredentialError,
  getBackendAccessToken,
} from "@/lib/shared/auth/backend-credentials";

// POST /api/studies/[study_id]/images
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ study_id: string }> },
) {
  // get study_id
  const { study_id } = await context.params;
  const session = await getServerSession(authOptions);

  // check if user is authenticated and has the Doctor role
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user?.role !== "Doctor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let accessToken: string;
  try {
    accessToken = await getBackendAccessToken();
  } catch (error) {
    const status = error instanceof BackendCredentialError ? 401 : 500;
    return NextResponse.json(
      {
        error:
          status === 401 ? "Unauthorized" : "Unable to authenticate upload",
      },
      { status },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request" },
      { status: 400 },
    );
  }

  // get images from formData
  try {
    const res = await fetch(`${getServerApiUrl()}/studies/${study_id}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    // Do not proxy backend/database details through a browser-facing route.
    if (!res.ok) {
      return NextResponse.json(
        { error: "Unable to upload study images" },
        { status: res.status >= 500 ? 502 : res.status },
      );
    }

    const data: unknown = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the upload service" },
      { status: 502 },
    );
  }
}
