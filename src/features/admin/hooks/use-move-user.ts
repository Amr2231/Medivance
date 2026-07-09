import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deactivateUserAction,
  transferPatientsAction,
} from "../actions/users.actions";
import { toast } from "sonner";

// Move User
export function useMoveUser() {
  // queryClient
  const queryClient = useQueryClient();

  // mutations
  return useMutation({
    mutationFn: async ({
      id,
      newDoctorId,
    }: {
      id: number;
      newDoctorId?: number;
    }) => {
      let didTransfer = false;

      if (newDoctorId !== undefined) {
        const transfer = await transferPatientsAction(id, newDoctorId);

        // transfer failed
        if (!transfer.message?.toLowerCase().includes("transferred")) {
          throw new Error(
            transfer.error ?? transfer.message ?? "Transfer failed",
          );
        }
        didTransfer = true;
      }

      const deactivate = await deactivateUserAction(id);

      if (!deactivate.message?.toLowerCase().includes("deactivated")) {
        throw new Error(
          deactivate.error ?? deactivate.message ?? "Deactivation failed",
        );
      }

      return { didTransfer };
    },

    onSuccess: ({ didTransfer }) => {
      toast.success(
        didTransfer
          ? "Patients transferred and ready to delete!"
          : "doctor already deactivated successfully!",
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong");
    },
  });
}
