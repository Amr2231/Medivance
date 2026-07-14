"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActivePatient, UpdatePatientPayload } from "@/lib/types/doctor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function EditPatientForm({
  patient,
  onClose,
  onSave,
  isPending,
}: {
  patient: ActivePatient;
  onClose: () => void;
  onSave: (national_id: string, payload: UpdatePatientPayload) => void;
  isPending?: boolean;
}) {
  const [form, setForm] = useState<UpdatePatientPayload>(() => ({
    first_name: patient.first_name,
    last_name: patient.last_name,
    study_type: patient.study,
    study_date: patient.received_date,
  }));

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg font-bold text-gray-900">
          Edit Patient
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Edit information for {patient.first_name} {patient.last_name}
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <p className="text-xs text-gray-400 mb-1">First Name</p>
          <Input
            value={form.first_name ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, first_name: e.target.value }))
            }
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Last Name</p>
          <Input
            value={form.last_name ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, last_name: e.target.value }))
            }
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Phone Number</p>
          <Input
            value={form.phone_number ?? ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                phone_number: e.target.value.replace(/\D/g, ""),
              }))
            }
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Image Date</p>
          <Input
            type="date"
            value={form.study_date ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, study_date: e.target.value }))
            }
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Gender</p>
          <Select
            value={form.gender ?? ""}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, gender: v as "Male" | "Female" }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={isPending}
          className="bg-[#059669] text-white"
          onClick={() => onSave(patient.national_id, form)}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function EditPatientModal({
  patient,
  onClose,
  onSave,
  isPending,
}: {
  patient: ActivePatient | null;
  onClose: () => void;
  onSave: (national_id: string, payload: UpdatePatientPayload) => void;
  isPending?: boolean;
}) {
  if (!patient) return null;

  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <EditPatientForm
          key={patient.national_id}
          patient={patient}
          onClose={onClose}
          onSave={onSave}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
