import { useState, type RefObject } from "react";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { EmptyState } from "~/components/home/empty-state";
import { EventsList } from "~/components/home/events-list";
import { Button } from "~/components/ui/button";
import { EventDetailSheet } from "~/modules/home/current-events/event-detail-sheet";

import type {
  CurrentEventsPage,
  EnrichedKaraokeEvent,
} from "~/modules/home/types";

const EVENT_LIST_SKELETON_KEYS = [
  "current-event-skeleton-1",
  "current-event-skeleton-2",
  "current-event-skeleton-3",
  "current-event-skeleton-4",
];

type CurrentEventsSectionProps = {
  query: UseInfiniteQueryResult<InfiniteData<CurrentEventsPage>, Error>;
  allEvents: EnrichedKaraokeEvent[];
  loadMoreRef: RefObject<HTMLDivElement | null>;
};

export function CurrentEventsSection({
  query,
  allEvents,
  loadMoreRef,
}: CurrentEventsSectionProps) {
  const [selectedEvent, setSelectedEvent] =
    useState<EnrichedKaraokeEvent | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">
            Current events
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Explore active karaoke plans and see what everyone is queuing up.
          </p>
        </div>
        <span className="rounded-full border border-zinc-200 bg-zinc-950 px-3 py-1 text-sm font-medium text-white">
          {allEvents.length} loaded
        </span>
      </div>

      {query.isPending ? (
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm shadow-black/5">
          <ul className="divide-y divide-zinc-200">
            {EVENT_LIST_SKELETON_KEYS.map((key) => (
              <li key={key} className="space-y-3 px-5 py-4">
                <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
              </li>
            ))}
          </ul>
        </div>
      ) : query.isError ? (
        <EmptyState
          title="We couldn't load current events"
          description={
            query.error instanceof Error
              ? query.error.message
              : "Please try again in a moment."
          }
        />
      ) : allEvents.length === 0 ? (
        <EmptyState
          title="No current events yet"
          description="Create the first karaoke plan and invite your crew to join in."
        />
      ) : (
        <>
          <EventsList events={allEvents} onEventClick={setSelectedEvent} />

          <div
            ref={loadMoreRef}
            className="flex flex-col items-center gap-3 py-4"
          >
            {query.hasNextPage ? (
              <>
                <p className="text-sm text-zinc-500">
                  {query.isFetchingNextPage
                    ? "Loading more events..."
                    : "Scroll down or use the button to load more."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void query.fetchNextPage()}
                  disabled={query.isFetchingNextPage}
                >
                  {query.isFetchingNextPage ? "Loading..." : "Load more"}
                </Button>
              </>
            ) : (
              <p className="text-sm text-zinc-500">
                You have reached the end of the list.
              </p>
            )}
          </div>
        </>
      )}

      <EventDetailSheet
        event={selectedEvent}
        open={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      />
    </div>
  );
}
