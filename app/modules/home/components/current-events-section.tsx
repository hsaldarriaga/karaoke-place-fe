import type { RefObject } from "react";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { Button } from "~/components/ui/button";

import type { CurrentEventsPage, EnrichedKaraokeEvent } from "../types";
import { normalizeId } from "../utils";
import { EmptyState } from "./empty-state";
import { EventCard } from "./event-card";

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
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Current events</h2>
          <p className="mt-1 text-sm text-slate-300">
            Explore active karaoke plans and see what everyone is queuing up.
          </p>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-slate-300">
          {allEvents.length} loaded
        </span>
      </div>

      {query.isPending ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70"
            />
          ))}
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
          <div className="grid gap-4 xl:grid-cols-2">
            {allEvents.map((event) => (
              <EventCard
                key={
                  normalizeId(event.id) || `${event.name}-${event.startTime}`
                }
                event={event}
              />
            ))}
          </div>

          <div
            ref={loadMoreRef}
            className="flex flex-col items-center gap-3 py-4"
          >
            {query.hasNextPage ? (
              <>
                <p className="text-sm text-slate-400">
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
              <p className="text-sm text-slate-400">
                You have reached the end of the list.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
