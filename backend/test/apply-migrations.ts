import { applyD1Migrations } from "cloudflare:test"
import { env } from "cloudflare:workers"
import { createDb } from "@/db/client"
import { adminCredentials } from "@/db/schema"
import { hashPassword } from "@/lib/passwordHash"

// Setup files run outside per-test-file storage isolation and may run more
// than once — applyD1Migrations() only applies migrations not already
// applied, so this is safe to call unconditionally here.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS)

// Credentials live in D1 now (see lib/passwordHash.ts), not an env binding —
// seed the single test-admin row every test file's isolated storage needs.
// Each vitest-pool-workers test file gets fresh storage, so re-seeding here
// (rather than in a one-time migration) is what makes it available everywhere.
const db = createDb(env.DB)
const [existing] = await db.select().from(adminCredentials).limit(1)
if (!existing) {
  await db.insert(adminCredentials).values({
    username: "test-admin",
    passwordHash: await hashPassword("test-password"),
    updatedAt: Date.now(),
  })
}
