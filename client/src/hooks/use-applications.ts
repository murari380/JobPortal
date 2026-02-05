import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useCompanyApplications() {
  return useQuery({
    queryKey: [api.applications.listForCompany.path],
    queryFn: async () => {
      const res = await fetch(api.applications.listForCompany.path);
      if (!res.ok) throw new Error("Failed to fetch applications");
      return api.applications.listForCompany.responses[200].parse(await res.json());
    },
  });
}

export function useCandidateApplications() {
  return useQuery({
    queryKey: [api.applications.listForCandidate.path],
    queryFn: async () => {
      const res = await fetch(api.applications.listForCandidate.path);
      if (!res.ok) throw new Error("Failed to fetch applications");
      return api.applications.listForCandidate.responses[200].parse(await res.json());
    },
  });
}

export function useApplyForJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(api.applications.create.path, {
        method: api.applications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to submit application");
      return api.applications.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.applications.listForCandidate.path] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "pending" | "accepted" | "rejected" }) => {
      const url = buildUrl(api.applications.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.applications.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      return api.applications.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.applications.listForCompany.path] });
    },
  });
}
