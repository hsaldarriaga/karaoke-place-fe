import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import type { CurrentEventsPage, EnrichedKaraokeEvent } from "../types";

import { EVENTS_PAGE_SIZE } from "../constants";
import { fetchEnrichedEventsPage } from "~/modules/home/hooks/enriched-events";

export function useMyEvents(
  currentUserId: number | undefined,
  page: number,
  activeTab: string,
) {
  const isCreatedTab = activeTab === "created";
  const currentPage = Math.max(1, page);

  const createdEventsQuery = useQuery({
    queryKey: ["my-events", "created", currentUserId, currentPage],
    enabled: !!currentUserId && isCreatedTab,
    queryFn: () =>
      fetchEnrichedEventsPage({
        isActive: true,
        createdByUserId: currentUserId,
        Page: currentPage,
        PageSize: EVENTS_PAGE_SIZE,
      }),
  });

  const participatingEventsQuery = useQuery({
    queryKey: ["my-events", "participating", currentUserId, currentPage],
    enabled: !!currentUserId && !isCreatedTab,
    queryFn: () =>
      fetchEnrichedEventsPage({
        isActive: true,
        participantUserId: currentUserId,
        Page: currentPage,
        PageSize: EVENTS_PAGE_SIZE,
      }),
  });

  const createdEvents = createdEventsQuery.data?.items ?? [];

  const participatingEvents: EnrichedKaraokeEvent[] = useMemo(
    () =>
      (participatingEventsQuery.data?.items ?? []).filter(
        (event: EnrichedKaraokeEvent) =>
          event.createdByUserId !== currentUserId,
      ),
    [currentUserId, participatingEventsQuery.data],
  );

  return {
    events: isCreatedTab ? createdEvents : participatingEvents,
    isLoading: isCreatedTab
      ? createdEventsQuery.isLoading
      : participatingEventsQuery.isLoading,
    error: isCreatedTab
      ? createdEventsQuery.error
      : participatingEventsQuery.error,
    pagination: getPaginationState(
      isCreatedTab ? createdEventsQuery.data : participatingEventsQuery.data,
      currentPage,
    ),
  };
}

function getPaginationState(
  pageData: CurrentEventsPage | undefined,
  currentPage: number,
) {
  const totalPages = Math.max(1, Number(pageData?.totalPages ?? 1));
  const totalCount = Number(pageData?.totalCount ?? 0);

  return {
    currentPage,
    totalPages,
    totalCount,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
}
