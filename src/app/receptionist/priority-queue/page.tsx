import { redirect } from "next/navigation";

// metadata for receptionist priority queue page
export const metadata = {
  title: "Priority Queue | Medivance",
  description: "View and manage your priority queue in the Receptionist Portal",
};

// receptionist priority queue page
export default function Page() {
  redirect("/receptionist/arrival-board");
}
