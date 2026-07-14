"use server";

import { completeStudy } from "../api/studies.api";
import type { MutationResponse } from "@/lib/types/doctor";

// complete study
export async function completeStudyAction(
  study_id: string,
): Promise<MutationResponse> {
  return completeStudy(study_id);
}
