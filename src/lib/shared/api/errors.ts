export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly field?: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Parse error message from API response, with fallback to status code
export async function parseApiErrorMessage(res: Response): Promise<string> {
  const body: unknown = await res.json().catch(() => null);
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
  ) {
    return (body as { message: string }).message;
  }
  return `Request failed (${res.status})`;
}
