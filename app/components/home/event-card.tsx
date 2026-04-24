import type { EnrichedKaraokeEvent } from "~/modules/home/types";
import { formatDateRange } from "~/modules/home/utils";

export function EventCard({ event }: { event: EnrichedKaraokeEvent }) {
  const previewSongs = event.previewSongs.slice(0, 3);

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm shadow-black/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Karaoke event
          </p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-950">
            {event.name ?? "Untitled karaoke night"}
          </h3>
        </div>
        <span className="rounded-full border border-zinc-200 bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
          {event.isActive ? "Open" : "Planned"}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-zinc-600">
        {event.description ??
          "Pick songs, invite friends, and plan your next karaoke meetup."}
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Place
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900">
            {event.location ?? "To be confirmed"}
          </dd>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Date
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900">
            {formatDateRange(event.startTime, event.hours)}
          </dd>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            People
          </dt>
          <dd className="mt-1 text-sm font-medium text-zinc-900">
            {event.participantCount} joined
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Song preview
        </p>
        {previewSongs.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {previewSongs.map((song) => (
              <li
                key={song.id ?? `${song.title}-${song.artist}`}
                className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs text-zinc-800"
              >
                {song.title ?? "Untitled"}
                {song.artist ? ` · ${song.artist}` : ""}
              </li>
            ))}
          </ul>
        ) : event.proposalCount > 0 ? (
          <p className="mt-2 text-sm text-zinc-600">
            {event.proposalCount} songs proposed so far.
          </p>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">No songs proposed yet.</p>
        )}
      </div>
    </article>
  );
}
