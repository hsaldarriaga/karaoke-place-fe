import type { UseQueryResult } from "@tanstack/react-query";

import type { UserModel } from "~/gen/models";

import type { EnrichedKaraokeEvent } from "../types";
import { EmptyState } from "./empty-state";
import { EventCard } from "./event-card";

type MyEventsSectionProps = {
  currentUserQuery: UseQueryResult<UserModel, Error>;
  currentUserId?: number;
  myEvents: EnrichedKaraokeEvent[];
};

export function MyEventsSection({
  currentUserQuery,
  currentUserId,
  myEvents,
}: MyEventsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-950">My events</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Events you created or already joined.
        </p>
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
      ) : myEvents.length === 0 ? (
        <EmptyState
          title="No events linked to you yet"
          description="Create a new karaoke plan or join one from the Current events tab."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {myEvents.map((event) => (
            <EventCard key={event.id.toString()} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
