import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, applicationsApi, JobsParams } from "@/services/api";
import { CreateJobPayload, JobApplication } from "@/types/job";

// ── Query key factory ─────────────────────────────────────────────────────────
export const jobKeys = {
  all:    ()           => ["jobs"]                       as const,
  lists:  ()           => [...jobKeys.all(), "list"]     as const,
  list:   (p: JobsParams) => [...jobKeys.lists(), p]     as const,
  detail: (id: number) => [...jobKeys.all(), "detail", id] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────
export const useJobsQuery = (params: JobsParams = {}) =>
  useQuery({
    queryKey: jobKeys.list(params),
    queryFn:  () => jobsApi.getJobs(params),
  });

export const useJobQuery = (id: number) =>
  useQuery({
    queryKey: jobKeys.detail(id),
    queryFn:  () => jobsApi.getJob(id),
    enabled:  id > 0,
  });

// ── Mutations ─────────────────────────────────────────────────────────────────
export const useCreateJobMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobPayload) => jobsApi.createJob(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: jobKeys.lists() }),
  });
};

export const useDeleteJobMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => jobsApi.deleteJob(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: jobKeys.lists() }),
  });
};

export const useSubmitApplicationMutation = () =>
  useMutation({
    mutationFn: (data: JobApplication) => applicationsApi.submit(data),
  });
