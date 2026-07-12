import { AuditLogsTable } from "@/features/admin";

// metadata for audit logs page
export const metadata = {
  title: "Audit Logs | Medivance",
  description: "View and manage audit logs for your Medivance account",
};

// Audit Logs Page
export default function AuditLogsPage() {
  return <AuditLogsTable />;
}
