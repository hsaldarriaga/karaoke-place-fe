import type { AddPreferredSongDto } from "~/gen/models";

const MUSIC_BRAINZ_RECORDING_SEARCH_URL =
  "https://musicbrainz.org/ws/2/recording";
const DEFAULT_SEARCH_LIMIT = 10;
const MAX_SEARCH_LIMIT = 25;
const MUSIC_BRAINZ_MIN_INTERVAL_MS = 1000;

let lastMusicBrainzRequestAt = 0;
let musicBrainzRequestQueue: Promise<void> = Promise.resolve();

export type SongSearchResult = Pick<
  AddPreferredSongDto,
  "externalId" | "artist" | "title"
>;

type MusicBrainzArtistCredit = {
  name?: string;
  joinphrase?: string;
  artist?: {
    name?: string;
  };
};

type MusicBrainzRecording = {
  id: string;
  title?: string;
  "artist-credit"?: MusicBrainzArtistCredit[];
};

type MusicBrainzRecordingSearchResponse = {
  recordings?: MusicBrainzRecording[];
};

function normalizeLimit(limit: number) {
  return Math.min(Math.max(Math.trunc(limit), 1), MAX_SEARCH_LIMIT);
}

function formatArtist(artistCredit: MusicBrainzArtistCredit[] = []) {
  const artist = artistCredit
    .map((credit) => {
      const name = credit.name ?? credit.artist?.name ?? "";
      return `${name}${credit.joinphrase ?? ""}`;
    })
    .join("")
    .trim();

  return artist || "Unknown artist";
}

function createAbortError() {
  const error = new Error("The operation was aborted.");
  error.name = "AbortError";
  return error;
}

function waitForDelay(ms: number, signal?: AbortSignal) {
  if (ms <= 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, ms);

    function handleAbort() {
      clearTimeout(timeoutId);
      reject(createAbortError());
    }

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

async function waitForMusicBrainzSlot(signal?: AbortSignal) {
  const elapsed = Date.now() - lastMusicBrainzRequestAt;
  const remainingDelay = Math.max(0, MUSIC_BRAINZ_MIN_INTERVAL_MS - elapsed);

  await waitForDelay(remainingDelay, signal);
  lastMusicBrainzRequestAt = Date.now();
}

async function runWithMusicBrainzRateLimit<T>(
  request: () => Promise<T>,
  signal?: AbortSignal,
) {
  const waitTask = musicBrainzRequestQueue.then(() =>
    waitForMusicBrainzSlot(signal),
  );

  musicBrainzRequestQueue = waitTask.catch(() => undefined);

  await waitTask;
  return request();
}

/**
 * Search MusicBrainz recordings and return song data in the same shape
 * expected by the app when creating or storing songs.
 */
export async function searchSongs(
  query: string,
  limit = DEFAULT_SEARCH_LIMIT,
  signal?: AbortSignal,
): Promise<SongSearchResult[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const url = new URL(MUSIC_BRAINZ_RECORDING_SEARCH_URL);
  url.searchParams.set("query", trimmedQuery);
  url.searchParams.set("fmt", "json");
  url.searchParams.set("limit", normalizeLimit(limit).toString());

  return runWithMusicBrainzRateLimit(async () => {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `MusicBrainz recording search failed with status ${response.status}.`,
      );
    }

    const data = (await response.json()) as MusicBrainzRecordingSearchResponse;

    return (data.recordings ?? []).map((recording) => ({
      externalId: recording.id,
      artist: formatArtist(recording["artist-credit"]),
      title: recording.title?.trim() || "Untitled track",
    }));
  }, signal);
}
