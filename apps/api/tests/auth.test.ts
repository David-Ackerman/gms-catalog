import test from "node:test";
import assert from "node:assert/strict";
import { comparePassword, hashPassword } from "../src/utils/hash";
import { signJwt, verifyJwt } from "../src/utils/jwt";

test("hashPassword and comparePassword work together", async () => {
  process.env.JWT_SECRET = "test-secret";

  const password = "SuperSecret123!";
  const hashed = await hashPassword(password);

  assert.notEqual(hashed, password);
  assert.equal(await comparePassword(password, hashed), true);
  assert.equal(await comparePassword("wrong-password", hashed), false);
});

test("signJwt and verifyJwt round-trip a payload", () => {
  process.env.JWT_SECRET = "test-secret";

  const payload = {
    id: "user-123",
    email: "player@example.com",
    role: "ADMIN" as const,
  };

  const token = signJwt(payload, "1h");
  const verified = verifyJwt(token);

  assert.equal(verified.id, payload.id);
  assert.equal(verified.email, payload.email);
  assert.equal(verified.role, payload.role);
});
