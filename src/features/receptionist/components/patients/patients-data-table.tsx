"use client";

import { memo, type ReactNode } from "react";
import { Eye, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tailwind-merge";
import type { ActivePatient } from "@/lib/types/receptionist";
import { TABLE_HEADERS } from "@/lib/constants/patient-table.constants";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "./status-badge";
import { TableCard } from "@/components/shared/table-card";
import { PatientAvatar } from "@/components/shared/patient-avatar";

// Types

interface PatientsDataTableProps {
  patients: ActivePatient[];
  onView: (p: ActivePatient) => void;
  onEdit: (p: ActivePatient) => void;
  onDelete: (p: ActivePatient) => void;
  toolbar?: ReactNode;
  footer?: ReactNode;
  isFetching?: boolean;
}

interface PatientRowProps {
  patient: ActivePatient;
  onView: (p: ActivePatient) => void;
  onEdit: (p: ActivePatient) => void;
  onDelete: (p: ActivePatient) => void;
}

// PatientRow
function canDeactivatePatient(status: ActivePatient["status"]) {
  return status === "Scheduled";
}

const PatientRow = memo(function PatientRow({
  patient,
  onView,
  onEdit,
  onDelete,
}: PatientRowProps) {
  return (
    <TableRow
      className={cn(
        "border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-900/40 group",
      )}
    >
      <TableCell className="pl-4 py-3">
        <div className="flex items-center gap-3">
          <PatientAvatar
            firstName={patient.first_name}
            lastName={patient.last_name}
            study={patient.study_type}
          />
          <div className="min-w-0 flex flex-col">
            <span className="font-medium text-gray-800 truncate dark:text-gray-200 ">
              {patient.first_name} {patient.last_name}
            </span>

            <span className="text-xs text-gray-400 font-mono">
              {patient.national_id}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
        {patient.doctor_name ?? "—"}
      </TableCell>

      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(patient.study_date).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </TableCell>

      <TableCell>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
          <StatusBadge status={patient.status}></StatusBadge>
        </span>
      </TableCell>

      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
        {patient.phone_number}
      </TableCell>

      <TableCell className="pr-4">
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-300"
            onClick={() => onView(patient)}
            title="View patient"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-300"
            onClick={() => onEdit(patient)}
            title="Edit patient"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-300 disabled:opacity-40"
            onClick={() => onDelete(patient)}
            title={
              canDeactivatePatient(patient.status)
                ? "Deactivate patient"
                : "Only Scheduled patients can be deactivated"
            }
            disabled={!canDeactivatePatient(patient.status)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

//  PatientsDataTable
export const PatientsDataTable = memo(function PatientsDataTable({
  patients,
  onView,
  onEdit,
  onDelete,
  toolbar,
  footer,
  isFetching,
}: PatientsDataTableProps) {
  return (
    <TableCard toolbar={toolbar} footer={footer} isFetching={isFetching}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/70 hover:bg-gray-50/70 border-b border-gray-200 dark:bg-gray-900/50 dark:border-gray-800">
            {TABLE_HEADERS.map((h) => (
              <TableHead
                key={h}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 first-of-type:pl-4"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={TABLE_HEADERS.length + 1}>
                <EmptyState
                  icon={Users}
                  title="No patients found"
                  description="Try adjusting your search or filters"
                />
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <PatientRow
                key={patient.national_id}
                patient={patient}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  );
});
