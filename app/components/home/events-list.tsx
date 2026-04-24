import type { EnrichedKaraokeEvent } from "~/modules/home/types";
import { formatDateRange } from "~/modules/home/utils";

type EventsListProps = {
  events: EnrichedKaraokeEvent[];
  onEventClick?: (event: EnrichedKaraokeEvent) => void;
};

export function EventsList({ events, onEventClick }: EventsListProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm shadow-black/5">
      <ul className="divide-y divide-zinc-200">
        {events.map((event) => {
          const previewSongs = event.previewSongs.slice(0, 3);

          return (
            <li
              key={event.id.toString()}
              className="px-5 py-4 cursor-pointer hover:bg-zinc-50 transition-colors"
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-zinc-950">
                          {event.name ?? "Untitled karaoke night"}
                        </h3>
                        <span className="rounded-full border border-zinc-200 bg-zinc-950 px-2.5 py-0.5 text-xs font-medium text-white">
                          {event.isActive ? "Open" : "Planned"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-zinc-600">
                        {event.description ??
                          "Pick songs, invite friends, and plan your next karaoke meetup."}
                      </p>
                    </div>

                    <div className="shrink-0 text-sm text-zinc-600 sm:text-right">
                      <p>{formatDateRange(event.startTime, event.hours)}</p>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-zinc-600">
                    {event.location ?? "To be confirmed"}
                  </p>

                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    {previewSongs.length > 0 ? (
                      <p className="text-sm text-zinc-500">
                        Songs:{" "}
                        {previewSongs
                          .map((song) => song.title ?? "Untitled")
                          .join(", ")}
                      </p>
                    ) : (
                      <div />
                    )}

                    <span className="text-sm text-zinc-600 sm:text-right">
                      {event.participantCount} joined
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
