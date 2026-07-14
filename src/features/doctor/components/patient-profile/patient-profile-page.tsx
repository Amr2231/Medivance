"use client";

import { useState } from "react";
import Link from "next/link";
import { GitCompare, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import {
  DoctorErrorState,
  DoctorLoadingState,
  DoctorPageShell,
  DoctorTabs,
} from "../shared/ui";
import type { ActivePatient } from "@/lib/types/doctor";
import { useAddToWatchlist } from "../../hooks/use-watchlist";
import { usePatientProfile } from "../../hooks/use-patient-profile";

type Tab = "overview" | "visits" | "notes" | "follow-ups";

export function PatientProfilePage({ nationalId }: { nationalId: string }) {
  const { data, isLoading, isError, refetch } = usePatientProfile(nationalId);
  const { mutate: addWatchlist } = useAddToWatchlist();
  const [tab, setTab] = useState<Tab>("overview");

  if (isLoading) return <DoctorLoadingState />;
  if (isError || !data?.patient) {
    return (
      <DoctorPageShell
        title="Patient Profile"
        description="Clinical record overview"
      >
        <DoctorErrorState onRetry={() => refetch()} />
      </DoctorPageShell>
    );
  }

  const { patient, visits, source } = data;
  const studyId = patient.studies?.study_id;

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "visits" as const, label: "Visits" },
    { id: "notes" as const, label: "Doctor Notes" },
    { id: "follow-ups" as const, label: "Follow-Ups" },
  ];

  return (
    <DoctorPageShell
      title={`${patient.first_name} ${patient.last_name}`}
      description={`National ID: ${patient.national_id} · ${source === "active" ? "Active" : "Historical"}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              addWatchlist({
                national_id: patient.national_id,
                priority: "monitor",
              })
            }
          >
            <Star className="w-4 h-4" /> Watchlist
          </Button>
          <Link href={`/doctor/compare-visits?nationalId=${patient.national_id}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <GitCompare className="w-4 h-4" /> Compare Visits
            </Button>
          </Link>
          {studyId && (
            <Link href={`/doctor/patients/${studyId}/report`}>
              <Button
                size="sm"
                className="bg-emerald-800 hover:bg-emerald-900 text-white"
              >
                Open Image
              </Button>
            </Link>
          )}
        </div>
      }
    >
      <DoctorTabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileSection title="Basic Information">
            <InfoRow
              label="Name"
              value={`${patient.first_name} ${patient.last_name}`}
            />
            <InfoRow label="Gender" value={patient.gender} />
            <InfoRow label="National ID" value={patient.national_id} />
            <InfoRow label="Image" value={patient.study} />
          </ProfileSection>
          <ProfileSection title="Clinical Status">
            <InfoRow label="Report Status" value={patient.report_status} />
            <InfoRow
              label="Patient Status"
              value={
                source === "active"
                  ? (patient as ActivePatient).patient_status
                  : "Completed"
              }
            />
            <InfoRow label="Assigned Doctor" value={patient.assigned_doctor} />
            <InfoRow
              label="Received"
              value={formatFullTimestamp(patient.received_date)}
            />
          </ProfileSection>
          <ProfileSection title="Allergies">
            <UnavailableField
              label={
                <EmptyState
                  icon={User}
                  title="No allergy information"
                  description="Allergy details are not available from the current API."
                />
              }
            />
          </ProfileSection>
          <ProfileSection title="Chronic Diseases">
            <UnavailableField
              label={
                <EmptyState
                  icon={User}
                  title="No chronic disease information"
                  description="Chronic disease details are not available from the current API."
                />
              }
            />
          </ProfileSection>
        </div>
      )}

      {tab === "visits" && (
        <div className="space-y-3">
          {visits.length === 0 ? (
            <EmptyState
              icon={User}
              title="No visit history"
              description="Historical visits will appear when available."
            />
          ) : (
            visits.map((v) => (
              <div
                key={v.id}
                className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{v.study}</p>
                  <p className="text-xs text-gray-500">
                    {formatFullTimestamp(v.received_date)} · {v.report_status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "notes" && (
        <ProfileSection title="Image Notes">
          {(patient.studies?.notes ?? []).length === 0 ? (
            <UnavailableField
              label={
                <EmptyState
                  icon={User}
                  title="No doctor notes"
                  description="Doctor notes will appear when available."
                />
              }
            />
          ) : (
            <ul className="space-y-2">
              {patient.studies.notes.map((note) => (
                <li
                  key={note.id}
                  className="text-sm border-b border-gray-100 pb-2"
                >
                  <p>{note.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {note.doctor} · {formatFullTimestamp(note.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </ProfileSection>
      )}

      {tab === "follow-ups" && (
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">Manage follow-ups from the</p>
          <Link
            href="/doctor/follow-ups"
            className="text-sm text-emerald-800 hover:underline font-medium"
          >
            Follow-Up Center
          </Link>
        </div>
      )}
    </DoctorPageShell>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 dark:text-gray-200 text-right">
        {value}
      </span>
    </div>
  );
}

function UnavailableField({ label }: { label: React.ReactNode }) {
  return <div>{label}</div>;
}
