import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DoctorOption = { user_id: number; first_name: string; last_name: string };
type Props = {
  doctors: DoctorOption[];
  doctorId: string;
  date: string;
  nationalId: string;
  duration: string;
  bookingLocked: boolean;
  lastBookedTime: string | null;
  isSuggesting: boolean;
  onDoctorChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onNationalIdChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onSuggest: () => void;
  onNewBooking: () => void;
};

export function SchedulingForm({
  doctors,
  doctorId,
  date,
  nationalId,
  duration,
  bookingLocked,
  lastBookedTime,
  isSuggesting,
  onDoctorChange,
  onDateChange,
  onNationalIdChange,
  onDurationChange,
  onSuggest,
  onNewBooking,
}: Props) {
  return (
    <div className="space-y-5 rounded-xl border bg-card p-5">
      <Field label="Doctor">
        <Select value={doctorId} onValueChange={onDoctorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.user_id} value={String(doctor.user_id)}>
                {doctor.first_name} {doctor.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Date">
        <Input
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
        />
      </Field>
      <Field label="Patient National ID">
        <Input
          value={nationalId}
          onChange={(event) => onNationalIdChange(event.target.value)}
          maxLength={14}
          placeholder="14 digits"
        />
      </Field>
      <Field label="Duration">
        <Select value={duration} onValueChange={onDurationChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[15, 30, 45, 60].map((minutes) => (
              <SelectItem key={minutes} value={String(minutes)}>
                {minutes} minutes
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      {bookingLocked && (
        <>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Booked {lastBookedTime?.slice(0, 5)}. Start a new booking to
            continue.
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onNewBooking}
          >
            New Booking
          </Button>
        </>
      )}
      <Button
        className="w-full"
        onClick={onSuggest}
        disabled={isSuggesting || !doctorId || bookingLocked}
      >
        <Sparkles className="mr-2 size-4" />
        {isSuggesting ? "Analyzing..." : "Suggest Best Slots"}
      </Button>
    </div>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
