import { trpc } from "@/lib/trpc";

export function useAuth() {
  const userQuery = trpc.auth.me.useQuery();
  const utils = trpc.useUtils();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => utils.auth.me.invalidate(),
  });

  return {
    user: userQuery.data,
    loading: userQuery.isLoading,
    logout: () => logoutMutation.mutate(),
  };
}