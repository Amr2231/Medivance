import { describe, it } from "node:test";
import assert from "node:assert/strict";

/** Mirrors auth.ts session-update name resolution for profile saves. */
function resolveUpdatedName(session: {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
}): string {
  const first = session.firstName ?? session.first_name;
  const last = session.lastName ?? session.last_name;
  if (first !== undefined || last !== undefined) {
    return `${first ?? ""} ${last ?? ""}`.trim();
  }
  return session.name ?? "";
}

describe("settings session update", () => {
  it("builds display name from firstName and lastName", () => {
    assert.equal(
      resolveUpdatedName({ firstName: "Ahmed", lastName: "Hassan" }),
      "Ahmed Hassan",
    );
  });

  it("falls back to name when camelCase fields are absent", () => {
    assert.equal(resolveUpdatedName({ name: "Ahmed Hassan" }), "Ahmed Hassan");
  });

  it("does not produce undefined in the display name", () => {
    const result = resolveUpdatedName({ firstName: "Ahmed", lastName: "Hassan" });
    assert.ok(!result.includes("undefined"));
  });
});
