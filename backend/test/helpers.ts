/** `Response.json()` types as `unknown` under the generated Workers types — this just names the shape at the call site. */
export async function readJson<T = unknown>(response: Response): Promise<T> {
  return (await response.json()) as T
}
