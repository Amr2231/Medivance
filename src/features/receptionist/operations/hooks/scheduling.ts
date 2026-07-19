"use client";
import { useMutation } from "@tanstack/react-query";
import { suggestSlots } from "../actions/scheduling.actions";
export function useSuggestSlots() {
  return useMutation({ mutationFn: suggestSlots });
}
