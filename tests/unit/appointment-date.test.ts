import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeAppointmentDate } from "../../src/features/receptionist/utils/appointment-date.ts";

describe("normalizeAppointmentDate", () => {
  it("extracts date from datetime-local values", () => {
    assert.equal(normalizeAppointmentDate("2026-06-05T14:30"), "2026-06-05");
  });

  it("keeps plain date strings", () => {
    assert.equal(normalizeAppointmentDate("2026-06-05"), "2026-06-05");
  });
});
