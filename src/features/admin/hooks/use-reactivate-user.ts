import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactivateUserAction } from "../actions/users.actions";
import { toast } from "sonner";

export function useReactivateUser() {
  const queryClient = useQueryClient();

  // Mutations
  return useMutation({
    mutationFn: (id: number) => reactivateUserAction(id),
    onSuccess: (data) => {
      if (data.message === "User reactivated") {
        toast.success("User reactivated successfully!");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["users", "inactive"] });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    },
    onError: () => {
      toast.error("Network error, please try again");
    },
  });
}
