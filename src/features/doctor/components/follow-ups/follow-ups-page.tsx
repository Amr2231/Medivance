"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  DoctorLoadingState,
  DoctorPageShell,
  DoctorTableCard,
  DoctorTabs,
} from "../shared/ui";
import {
  useCreateFollowUp,
  useDeleteFollowUp,
  useFollowUps,
  useMarkFollowUpDone,
} from "../../hooks/use-followups";

// schemas
const createSchema = z.object({
  national_id: z.string().min(1, "National ID required"),
  days: z.coerce.number().min(1, "Min 1 day"),
  reason: z.string().min(3, "Reason required"),
  priority: z.string().optional(),
});

// types
type CreateForm = z.infer<typeof createSchema>;
type FilterTab = "all" | "today" | "upcoming" | "overdue";

// component
export function FollowUpsPage() {
  // hooks
  const [tab, setTab] = useState<FilterTab>("all");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useFollowUps(tab);
  const { mutate: create, isPending } = useCreateFollowUp();
  const { mutate: markDone } = useMarkFollowUpDone();
  const { mutate: remove } = useDeleteFollowUp();

  // form
  const form = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      days: 7,
      priority: "Routine",
      reason: "",
      national_id: "",
    },
  });

  // data
  const items = data?.data ?? [];
  const tabs = [
    { id: "all" as const, label: "All" },
    { id: "today" as const, label: "Due Today" },
    { id: "upcoming" as const, label: "Upcoming" },
    { id: "overdue" as const, label: "Overdue" },
  ];

  const onSubmit = form.handleSubmit((values) => {
    create(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  });

  // loading state
  if (isLoading) return <DoctorLoadingState />;

  return (
    <DoctorPageShell
      title="Follow-Up Center"
      description="Manage patient follow-up reminders"
      actions={
        <Button
          onClick={() => setOpen(true)}
          className="bg-emerald-800 hover:bg-emerald-900 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> New Reminder
        </Button>
      }
    >
      <DoctorTabs tabs={tabs} active={tab} onChange={setTab} />

      <DoctorTableCard
        footer={
          items.length > 0 ? (
            <p className="text-sm text-gray-500">
              Showing {items.length} of {items.length} reminders
            </p>
          ) : undefined
        }
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200">
              {[
                "Patient",
                "Due Date",
                "Reason",
                "Priority",
                "Days Left",
                "Actions",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold text-gray-500 first:pl-4"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10">
                  <EmptyState
                    icon={Clock}
                    title="No follow-ups"
                    description="Create a reminder for a patient."
                  />
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.reminder_id}
                  className="border-b border-gray-100"
                >
                  <TableCell className="pl-4 text-sm font-medium">
                    {item.first_name} {item.last_name}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {formatFullTimestamp(item.due_date)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                    {item.reason}
                  </TableCell>
                  <TableCell className="text-sm">{item.priority}</TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {item.days_remaining}d
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={() => markDone(item.reminder_id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => remove(item.reminder_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DoctorTableCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Follow-up</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>National ID</Label>
              <Input
                {...form.register("national_id")}
                placeholder="Patient national ID"
              />
            </div>
            <div className="space-y-2">
              <Label>Days from now</Label>
              <Input type="number" {...form.register("days")} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input
                {...form.register("reason")}
                placeholder="Review after 7 days"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                defaultValue="Routine"
                onValueChange={(v) => form.setValue("priority", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine">Routine</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-800 hover:bg-emerald-900 text-white"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DoctorPageShell>
  );
}
