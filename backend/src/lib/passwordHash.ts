const ALGORITHM_TAG = "pbkdf2-sha256"
// Cloudflare Workers' production edge runtime hard-caps PBKDF2 at 100,000
// iterations (throws NotSupportedError above that) even though the local
// vitest-pool-workers/Miniflare sandbox silently allows more — this is the
// real ceiling, verified against a live deploy, not just local tests.
const ITERATIONS = 100_000
const SALT_BYTES = 16
const KEY_LENGTH_BITS = 256

function toBase64(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function deriveBits(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    KEY_LENGTH_BITS,
  )
  return new Uint8Array(bits)
}

/** Stored as `pbkdf2-sha256$<iterations>$<base64 salt>$<base64 hash>` — self-describing so the algorithm/cost can change later without breaking old rows. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const hash = await deriveBits(password, salt, ITERATIONS)
  return `${ALGORITHM_TAG}$${ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`
}

/** Constant-time-ish verify: always derives the full hash before comparing, so a mismatch can't be timed by early-exit. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$")
  if (parts.length !== 4 || parts[0] !== ALGORITHM_TAG) return false

  const iterations = Number(parts[1])
  if (!Number.isInteger(iterations) || iterations <= 0) return false

  const salt = fromBase64(parts[2])
  const expected = fromBase64(parts[3])
  const actual = await deriveBits(password, salt, iterations)

  if (actual.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < actual.length; i += 1) diff |= actual[i] ^ expected[i]
  return diff === 0
}
