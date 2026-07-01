import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// metadata for unauthorized page
export const metadata = {
  title: "Unauthorized | Medivance",
  description: "You do not have permission to view this page",
};

// UnauthorizedPage component
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-background">
      <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
        {/* Error icon */}
        <ShieldAlert className="w-7 h-7 text-destructive" />
      </div>

      {/* Access denied message */}
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="text-muted-foreground max-w-md">
        You do not have permission to view this page. Contact your administrator
        if you believe this is an error.
      </p>

      {/* Return to login button */}
      <Button asChild variant="outline">
        <Link href="/login">Return to login</Link>
      </Button>
    </div>
  );
}
