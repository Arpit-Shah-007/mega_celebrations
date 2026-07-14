import path from "node:path"
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers"
import { defineConfig } from "vitest/config"

export default defineConfig(async () => {
  const migrations = await readD1Migrations(path.join(__dirname, "migrations"))

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      cloudflareTest({
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          bindings: {
            TEST_MIGRATIONS: migrations,
            // Admin username/password now live in the admin_credentials table (seeded
            // by test/apply-migrations.ts) rather than an env binding — see lib/passwordHash.ts.
            SESSION_SECRET: "test-session-secret-not-for-production",
          },
        },
      }),
    ],
    test: {
      setupFiles: ["./test/apply-migrations.ts"],
    },
  }
})
