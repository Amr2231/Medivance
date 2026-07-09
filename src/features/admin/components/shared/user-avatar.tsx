import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/tailwind-merge";

// types
type UserAvatarProps = {
  firstName: string;
  lastName?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
};

// component — initials-only avatar (no photo data is available from the
export function UserAvatar({
  firstName,
  lastName,
  size = "default",
  className,
}: UserAvatarProps) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <Avatar size={size} className={cn("bg-emerald-800", className)}>
      <AvatarFallback className="bg-emerald-800 text-white font-medium">
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
