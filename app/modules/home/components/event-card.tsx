import type { EnrichedKaraokeEvent } from "../types";
import { formatDateRange, normalizeId } from "../utils";

export function EventCard({ event }: { event: EnrichedKaraokeEvent }) {
  const previewSongs = event.previewSongs.slice(0, 3);

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/85 p-5 shadow-lg shadow-slate-950/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Karaoke event
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            {event.name ?? "Untitled karaoke night"}
          </h3>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200">
          {event.isActive ? "Open" : "Planned"}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-300">
        {event.description ?? "Pick songs, invite friends, and plan your next karaoke meetup."}
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-800/70 p-3">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Place</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">
            {event.location ?? "To be confirmed"}
          </dd>
        </div>
        <div className="rounded-2xl bg-slate-800/70 p-3">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Date</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">
            {formatDateRange(event.startTime, event.endTime)}
          </dd>
        </div>
        <div className="rounded-2xl bg-slate-800/70 p-3">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">People</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">
            {event.participantCount} joined
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Song preview</p>
        {previewSongs.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {previewSongs.map((song) => (
              <li
                key={song.id ?? `${song.title}-${song.artist}`}
                className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100"
              >
                {song.title ?? "Untitled"}
                {song.artist ? ` · ${song.artist}` : ""}
              </li>
            ))}
          </ul>
        ) : event.proposalCount > 0 ? (
          <p className="mt-2 text-sm text-slate-300">
            {event.proposalCount} songs proposed so far.
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-300">No songs proposed yet.</p>
        )}
      </div>
    </article>
  );
}
