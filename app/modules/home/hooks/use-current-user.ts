import { useGetApiUsersMe } from "~/gen/api";

export function useCurrentUser() {
  const query = useGetApiUsersMe({
    query: {
      select: (response) => response.data,
      staleTime: 60 * 1000,
      retry: false,
    },
  });

  const currentUserId = query.data?.id;

  return { query, currentUserId };
}
