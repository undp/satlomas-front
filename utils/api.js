export function buildApiUrl(path) {
  return `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/"
  }${path}`;
}
