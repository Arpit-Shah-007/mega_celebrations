import { QueryClient } from "@tanstack/react-query"

/** No retries, no cache reuse across tests — every test gets a clean, fast, deterministic client. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })
}
