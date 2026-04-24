import type { UseQueryResult } from "@tanstack/react-query";

import { EmptyState } from "~/components/home/empty-state";
import { EventsList } from "~/components/home/events-list";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "~/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { UserModel } from "~/gen/models";
import type {
  EnrichedKaraokeEvent,
  PaginationState,
} from "~/modules/home/types";

import { CreateEventSheet } from "./create-event-sheet";

type MyEventsSectionProps = {
  currentUserQuery: UseQueryResult<UserModel, Error>;
  currentUserId?: number;
  events: EnrichedKaraokeEvent[];
  isLoading: boolean;
  error: Error | null;
  pagination: PaginationState;
  activeTab: string;
  onPageChange: (page: number) => void;
  onTabChange: (tab: string) => void;
};

export function MyEventsSection({
  currentUserQuery,
  currentUserId,
  error,
  events,
  isLoading,
  pagination,
  activeTab,
  onTabChange,
  onPageChange,
}: MyEventsSectionProps) {
  const canCreateEvent =
    !currentUserQuery.isPending && !currentUserQuery.isError && !!currentUserId;

  const emptyState =
    activeTab === "created"
      ? {
          title: "No events created by you yet",
          description: "Start a new karaoke plan to see it listed here.",
        }
      : {
          title: "No participant events yet",
          description:
            "Join one from the Current events tab to keep track of it here.",
        };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950">My events</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Switch between events you host and events you joined.
          </p>
        </div>

        <CreateEventSheet
          canCreateEvent={canCreateEvent}
          currentUserId={currentUserId}
        />
      </div>

      {currentUserQuery.isPending ? (
        <EmptyState
          title="Loading your karaoke profile"
          description="We are fetching your current account details from the API."
        />
      ) : currentUserQuery.isError ? (
        <EmptyState
          title="We couldn't load your karaoke profile"
          description={
            currentUserQuery.error instanceof Error
              ? currentUserQuery.error.message
              : "Please try again in a moment."
          }
        />
      ) : currentUserId == null ? (
        <EmptyState
          title="No karaoke account linked yet"
          description="The current-user API did not return a usable profile ID, so your events can't be listed yet."
        />
      ) : (
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList variant="line">
              <TabsTrigger value="created">Events I created</TabsTrigger>
              <TabsTrigger value="participating">
                Events I'm a participant
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <EmptyState
              title={
                activeTab === "created"
                  ? "Loading events you created"
                  : "Loading participant events"
              }
              description="We are fetching your karaoke events from the API."
            />
          ) : error ? (
            <EmptyState
              title="We couldn't load your events"
              description={error.message}
            />
          ) : events.length === 0 ? (
            <EmptyState
              title={emptyState.title}
              description={emptyState.description}
            />
          ) : (
            <EventsList events={events} />
          )}

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  disabled={!pagination.canGoPrevious}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(Math.max(1, pagination.currentPage - 1));
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  disabled={!pagination.canGoNext}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(pagination.currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
