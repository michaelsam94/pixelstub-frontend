import { API_BASE_URL } from "../config/env";
import type { PlaceholderSpec } from "../../features/placeholder-builder/model/schema";

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

export type BuildPlaceholderResponse = {
  url: string;
  spec: PlaceholderSpec;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    const fallback = {
      error: {
        code: "request_failed",
        message: "PixelStub could not complete the request"
      }
    };
    throw Object.assign(new Error(fallback.error.message), await response.json().catch(() => fallback));
  }

  return response.json() as Promise<T>;
}

export function buildPlaceholder(spec: PlaceholderSpec): Promise<BuildPlaceholderResponse> {
  return request<BuildPlaceholderResponse>("/api/placeholders/build", {
    method: "POST",
    body: JSON.stringify(spec)
  });
}

export function getImageUrl(spec: PlaceholderSpec): string {
  const params = encodeURIComponent(JSON.stringify(spec));
  return `${API_BASE_URL}/api/placeholders/image?spec=${params}`;
}

export function getHealth(): Promise<{ status: "ok" }> {
  return request<{ status: "ok" }>("/api/health");
}
