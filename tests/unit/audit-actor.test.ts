import { describe, it } from "node:test";
import assert from "node:assert/strict";

function formatFailedLoginActor(user: {
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  role_name?: string;
}): { actor_name: string; actor_role: string } {
  const actorName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
  return {
    actor_name: actorName,
    actor_role: user.role_name || "User",
  };
}

describe("audit failed login actor", () => {
  it("uses full name instead of email when available", () => {
    const result = formatFailedLoginActor({
      first_name: "Ahmed",
      last_name: "Admin",
      email: "ahmed.admin@hospital.com",
      role_name: "Admin",
    });
    assert.equal(result.actor_name, "Ahmed Admin");
    assert.equal(result.actor_role, "Admin");
  });

  it("never stores Unknown as the role for failed logins", () => {
    const result = formatFailedLoginActor({
      email: "ahmed.admin@hospital.com",
      role_name: "Admin",
    });
    assert.notEqual(result.actor_role, "Unknown");
  });
});
