import type { UseQueryResult } from "@tanstack/react-query";

import type { SongModel, UserModel } from "~/gen/models";

import { normalizeId } from "../utils";
import { EmptyState } from "./empty-state";

type MySongsSectionProps = {
  currentUserQuery: UseQueryResult<UserModel, Error>;
  mySongsQuery: UseQueryResult<SongModel[], Error>;
  currentUserId?: number;
};

export function MySongsSection({
  currentUserQuery,
  mySongsQuery,
  currentUserId,
}: MySongsSectionProps) {
  const songs = mySongsQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-white">My songs</h2>
        <p className="mt-1 text-sm text-slate-300">
          Your preferred karaoke tracks from the API.
        </p>
      </div>

      {currentUserQuery.isPending || mySongsQuery.isPending ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70"
            />
          ))}
        </div>
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
          description="The current-user API did not return a usable profile ID, so your preferred songs can't be listed yet."
        />
      ) : mySongsQuery.isError ? (
        <EmptyState
          title="We couldn't load your songs"
          description={
            mySongsQuery.error instanceof Error
              ? mySongsQuery.error.message
              : "Please try again in a moment."
          }
        />
      ) : songs.length === 0 ? (
        <EmptyState
          title="No favorite songs saved yet"
          description="Add some preferred songs and they will appear here automatically."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {songs.map((song) => (
            <article
              key={normalizeId(song.id) || `${song.title}-${song.artist}`}
              className="rounded-3xl border border-slate-800 bg-slate-900/85 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Preferred song
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {song.title ?? "Untitled track"}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                {song.artist ?? "Unknown artist"}
              </p>
              {song.externalId ? (
                <p className="mt-3 text-xs text-slate-400">
                  External ID: {song.externalId}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
