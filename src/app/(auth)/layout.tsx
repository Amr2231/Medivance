import Provider from "@/components/providers/shared";
import { AuthVisual } from "@/features/auth";

// layout for auth pages
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-row">
      <AuthVisual />
      <div className="flex flex-col w-full lg:w-1/2 shrink-0">
        {/* Form is centered on its own, independent of the footer below */}
        <div className="flex flex-col justify-center flex-1 px-6 py-12">
          <Provider>{children}</Provider>
        </div>
      </div>
    </div>
  );
}
