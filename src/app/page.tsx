import { LandingPage } from "@/components/marketing/landing-page";

// metadata for root page
export const metadata = {
  title: "Medivance — A Smarter Operating System for Modern Healthcare",
  description:
    "Medivance unifies patient management, radiology workflows, and clinical operations into a single, high-precision instrument for modern hospitals.",
};

// default export for the root marketing page
export default function Page() {
  return <LandingPage />;
}
