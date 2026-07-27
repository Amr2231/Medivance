import test from "node:test";
import assert from "node:assert/strict";
import { confidenceWidth, formatSlotTime } from "../../src/features/receptionist/operations/components/scheduling/utils/scheduling-utils.ts";

test("formats a scheduling slot as hours and minutes", () => {
  assert.equal(formatSlotTime("09:30:00"), "09:30");
});

test("clamps a scheduling confidence score for CSS", () => {
  assert.equal(confidenceWidth(-5), "0%");
  assert.equal(confidenceWidth(72), "72%");
  assert.equal(confidenceWidth(150), "100%");
});
