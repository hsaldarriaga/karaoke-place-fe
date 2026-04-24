import { useMemo } from "react";
import { useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { usePostApiUsersMePreferredSongs } from "~/gen/api";
import type { SongModel, UserModel } from "~/gen/models";
import type { SongSearchResult } from "~/lib/musicbrainz";

import { EmptyState } from "~/components/home/empty-state";
import { Skeleton } from "~/components/ui/skeleton";

import { AddSongSearch } from "./add-song-search";

const SONG_CARD_SKELETON_KEYS = [
  "song-card-skeleton-1",
  "song-card-skeleton-2",
  "song-card-skeleton-3",
  "song-card-skeleton-4",
];

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
  const queryClient = useQueryClient();
  const songs = useMemo(() => mySongsQuery.data ?? [], [mySongsQuery.data]);

  const existingSongIds = useMemo(
    () => new Set(songs.map((song) => song.externalId)),
    [songs],
  );

  const addPreferredSongMutation = usePostApiUsersMePreferredSongs({
    mutation: {
      onSuccess: async () => {
        toast.success("Song added to your preferred list.");
        await queryClient.invalidateQueries({
          queryKey: ["my-songs", currentUserId],
        });
      },
      onError: (error) => {
        const description =
          error instanceof Error
            ? error.message
            : "We couldn't save that song. Please try again.";

        toast.error("Couldn't save that song.", {
          description,
        });
      },
    },
  });

  const canSearch =
    !currentUserQuery.isPending &&
    !currentUserQuery.isError &&
    currentUserId != null;

  async function handleAddSong(song: SongSearchResult) {
    await addPreferredSongMutation.mutateAsync({
      data: {
        externalId: song.externalId,
        artist: song.artist,
        title: song.title,
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-950">My songs</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Search MusicBrainz and add preferred karaoke tracks to your list.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm shadow-black/5">
        <AddSongSearch
          existingSongIds={existingSongIds}
          disabled={!canSearch || addPreferredSongMutation.isPending}
          onAdd={handleAddSong}
        />

        {addPreferredSongMutation.isPending ? (
          <p className="mt-3 text-sm text-zinc-500">Adding song…</p>
        ) : null}
      </div>

      {currentUserQuery.isPending || mySongsQuery.isPending ? (
        <div className="grid gap-3 md:grid-cols-2">
          {SONG_CARD_SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-28 rounded-3xl" />
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
          description="Use the search above to add your first preferred song."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm shadow-black/5">
          <ul className="divide-y divide-zinc-200">
            {songs.map((song) => (
              <li key={song.id.toString()} className="px-5 py-4">
                <h3 className="text-base font-semibold text-zinc-950">
                  {song.title ?? "Untitled track"}
                </h3>
                <p className="text-sm text-zinc-600">
                  {song.artist ?? "Unknown artist"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
