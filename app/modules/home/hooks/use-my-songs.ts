import { useQuery } from "@tanstack/react-query";

import { getApiUsersIdPreferredSongs } from "~/gen/api";

export function useMySongs(currentUserId?: number) {
  return useQuery({
    queryKey: ["my-songs", currentUserId],
    enabled: currentUserId != null,
    queryFn: async () => (await getApiUsersIdPreferredSongs(currentUserId!)).data,
    staleTime: 60 * 1000,
  });
}
