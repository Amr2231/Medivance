import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserAction } from "../actions/users.actions";
import { toast } from "sonner";

export function useDeleteUser() {
  // queryClient
  const queryClient = useQueryClient();

  // useMutation
  return useMutation({
    mutationFn: (id: number) => deleteUserAction(id),
    onSuccess: (data) => {
      if (data.message === "User deleted") {
        toast.success("User deleted successfully!");
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
