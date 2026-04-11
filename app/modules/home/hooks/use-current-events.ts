import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import {
  getApiKaraokeEvents,
  getApiKaraokeEventsParticipants,
  getApiKaraokeEventsSongProposals,
} from "~/gen/api";
import type { SongModel } from "~/gen/models";

import { EVENTS_PAGE_SIZE } from "../constants";
import type { CurrentEventsPage, EnrichedKaraokeEvent } from "../types";

async function fetchCurrentEventsPage(
  pageParam: number,
): Promise<CurrentEventsPage> {
  const response = await getApiKaraokeEvents({
    isActive: true,
    Page: pageParam,
    PageSize: EVENTS_PAGE_SIZE,
  });
  const page = response.data;
  const events = page.items ?? [];
  const eventIds = events.map((event) => event.id);

  const [participantsResult, proposalsResult] = await Promise.allSettled([
    eventIds.length > 0
      ? getApiKaraokeEventsParticipants({ eventIds })
      : Promise.resolve({ data: [] }),
    eventIds.length > 0
      ? getApiKaraokeEventsSongProposals({ EventIds: eventIds })
      : Promise.resolve({ data: [] }),
  ]);

  const participantCountsByEvent = new Map<number, number>();
  const participantUserIdsByEvent = new Map<number, number[]>();

  if (participantsResult.status === "fulfilled") {
    for (const group of participantsResult.value.data ?? []) {
      if (group.eventId == null) {
        continue;
      }

      const participants = group.participants ?? [];

      participantCountsByEvent.set(group.eventId, participants.length);
      participantUserIdsByEvent.set(
        group.eventId,
        participants
          .map((participant) => participant.userId)
          .filter((userId): userId is number => userId != null),
      );
    }
  }

  const proposalCountsByEvent = new Map<number, number>();
  const previewSongsByEvent = new Map<number, SongModel[]>();

  if (proposalsResult.status === "fulfilled") {
    for (const group of proposalsResult.value.data ?? []) {
      if (group.eventId == null) {
        continue;
      }

      const songProposals = group.songProposals ?? [];

      proposalCountsByEvent.set(group.eventId, songProposals.length);
      previewSongsByEvent.set(
        group.eventId,
        songProposals
          .map((proposal) => proposal.song)
          .filter((song): song is SongModel => song != null)
          .slice(0, 3),
      );
    }
  }

  return {
    items: events.map((event) => {
      const eventId = event.id;
      const previewSongs =
        eventId == null ? [] : (previewSongsByEvent.get(eventId) ?? []);

      return {
        ...event,
        participantCount:
          eventId == null ? 0 : (participantCountsByEvent.get(eventId) ?? 0),
        participantUserIds:
          eventId == null ? [] : (participantUserIdsByEvent.get(eventId) ?? []),
        previewSongs,
        proposalCount:
          eventId == null
            ? previewSongs.length
            : (proposalCountsByEvent.get(eventId) ?? previewSongs.length),
      };
    }),
    page: page.page,
    totalPages: page.totalPages,
    totalCount: page.totalCount,
  };
}

export function useCurrentEvents() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["current-events"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchCurrentEventsPage(pageParam),
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
