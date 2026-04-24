import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { EVENTS_PAGE_SIZE } from "../constants";
import type { CurrentEventsPage, EnrichedKaraokeEvent } from "../types";

import { fetchEnrichedEventsPage } from "~/modules/home/hooks/enriched-events";

export function useCurrentEvents() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["current-events"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchEnrichedEventsPage({
        isActive: true,
        Page: pageParam,
        PageSize: EVENTS_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page ?? 1);
      const totalPages = Number(lastPage.totalPages ?? 1);

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  const allEvents: EnrichedKaraokeEvent[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.items ?? []) ?? [],
    [query.data],
  );

  const totalEvents = Number(
    query.data?.pages[0]?.totalCount ?? allEvents.length,
  );

  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node || !hasNextPage || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return { query, allEvents, totalEvents, loadMoreRef };
}
