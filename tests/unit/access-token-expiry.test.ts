import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAccessTokenExpiry } from "../../src/lib/shared/auth/access-token-expiry.ts";

function jwt(payload: object) {
  return `header.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.signature`;
}

describe("access-token expiry", () => {
  it("prefers an explicit backend expiry", () => {
    assert.equal(getAccessTokenExpiry(jwt({ exp: 1 }), 123_456), 123_456);
  });

  it("reads exp from a JWT when the legacy backend omits the field", () => {
    assert.equal(getAccessTokenExpiry(jwt({ exp: 1_800_000_000 })), 1_800_000_000_000);
  });

  it("does not invent an expiry for opaque tokens", () => {
    assert.equal(getAccessTokenExpiry("opaque-token"), undefined);
  });
});
