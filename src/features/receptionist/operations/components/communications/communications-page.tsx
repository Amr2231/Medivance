"use client";

import { useMemo, useState } from "react";
import { Phone, Plus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ReceptionPageShell } from "../shared/reception-page-shell";
import { TableToolbar, ReceptionLoadingState, StatusBadge } from "../shared/ui";
import {
  useCallbacks,
  useCreateCallback,
  useUpdateCallbackStatus,
  useAddContactAttempt,
  useCommunicationTimeline,
} from "../../hooks";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import PaginationWrapper from "@/components/ui/paginationWrapper";

export function CommunicationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedNationalId, setSelectedNationalId] = useState("");
  const [open, setOpen] = useState(false);

  const filters = useMemo(
    () => ({ search, status: status || undefined, page, limit: 10 }),
    [search, status, page],
  );

  const { data, isLoading } = useCallbacks(filters);
  const { mutate: createCallback, isPending: creating } = useCreateCallback();
  const { mutate: updateStatus } = useUpdateCallbackStatus();
  const { mutate: addAttempt } = useAddContactAttempt();
  const { data: timeline } = useCommunicationTimeline(selectedNationalId);

  const callbacks = data?.data ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / 10) || 1;

  const [form, setForm] = useState({
    patient_name: "",
    phone_number: "",
    reason: "",
    notes: "",
    priority: "Normal",
    national_id: "",
  });

  const handleCreate = () => {
    createCallback(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({
          patient_name: "",
          phone_number: "",
          reason: "",
          notes: "",
          priority: "Normal",
          national_id: "",
        });
      },
    });
  };

  if (isLoading && !data) return <ReceptionLoadingState />;

  return (
    <ReceptionPageShell
      title="Patient Communication Center"
      description="Callback requests, contact attempts, and communication history"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" /> New Callback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Callback Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Patient Name</Label>
                <Input
                  value={form.patient_name}
                  onChange={(e) =>
                    setForm({ ...form, patient_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({ ...form, phone_number: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>National ID</Label>
                <Input
                  value={form.national_id}
                  onChange={(e) =>
                    setForm({ ...form, national_id: e.target.value })
                  }
                  maxLength={14}
                />
              </div>
              <div>
                <Label>Reason *</Label>
                <Input
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={creating}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <div className="flex gap-3 mb-4 flex-wrap">
            <TableToolbar
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              searchPlaceholder="Search callbacks..."
              className="flex-1"
            />
            <Select
              value={status || "all"}
              onValueChange={(v) => {
                setStatus(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {callbacks.map((cb) => (
              <div
                key={cb.callback_id}
                className="rounded-xl border p-4 hover:bg-muted/30 cursor-pointer"
                onClick={() =>
                  cb.national_id && setSelectedNationalId(cb.national_id)
                }
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {cb.patient_name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cb.phone_number}
                    </p>
                    <p className="text-sm mt-1">{cb.reason}</p>
                  </div>
                  <StatusBadge label={cb.status} />
                </div>
                <div
                  className="flex gap-2 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      addAttempt({ id: cb.callback_id, outcome: "No Answer" })
                    }
                  >
                    <Phone className="w-3 h-3 mr-1" /> Log Call
                  </Button>
                  {cb.status === "Pending" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus({ id: cb.callback_id, status: "Closed" })
                      }
                    >
                      Close
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <PaginationWrapper
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-semibold mb-4">Communication Timeline</h2>
          {!selectedNationalId ? (
            <p className="text-sm text-muted-foreground">
              Select a callback with a patient ID to view timeline
            </p>
          ) : (
            <ol className="relative border-l border-border ml-2 space-y-6">
              {timeline?.communications?.map((c) => (
                <li key={c.communication_id} className="ml-4">
                  <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-[#059669]" />
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFullTimestamp(c.created_at)} · {c.created_by_name}
                  </p>
                  {c.content && <p className="text-sm mt-1">{c.content}</p>}
                </li>
              ))}
              {timeline?.contact_attempts?.map((a) => (
                <li key={a.attempt_id} className="ml-4">
                  <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-emerald-500" />
                  <p className="text-sm font-medium">Called — {a.outcome}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFullTimestamp(a.contacted_at)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </ReceptionPageShell>
  );
}
