import { Job, CreateJobPayload, JobApplication } from "@/types/job";

const BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5001/api"
    : "https://quickhire-five.vercel.app/api");

// ── Generic request helper ────────────────────────────────────────────────────
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json as T;
}

// ── Jobs API ──────────────────────────────────────────────────────────────────
export interface JobsParams {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  data: Job[];
}

export interface JobResponse {
  success: boolean;
  data: Job;
}

export const jobsApi = {
  getJobs: (params: JobsParams = {}): Promise<JobsResponse> => {
    const qs = new URLSearchParams();
    if (params.search)   qs.set("search",   params.search);
    if (params.category) qs.set("category", params.category);
    if (params.location) qs.set("location", params.location);
    if (params.page)     qs.set("page",     String(params.page));
    if (params.limit)    qs.set("limit",    String(params.limit));
    return request<JobsResponse>(`/jobs?${qs.toString()}`);
  },

  getJob: (id: number): Promise<JobResponse> =>
    request<JobResponse>(`/jobs/${id}`),

  createJob: (body: CreateJobPayload): Promise<JobResponse> =>
    request<JobResponse>("/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteJob: (id: number): Promise<{ success: boolean; message: string }> =>
    request(`/jobs/${id}`, { method: "DELETE" }),
};

// ── Applications API ──────────────────────────────────────────────────────────
export const applicationsApi = {
  submit: (body: JobApplication): Promise<{ success: boolean; data: unknown }> =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
