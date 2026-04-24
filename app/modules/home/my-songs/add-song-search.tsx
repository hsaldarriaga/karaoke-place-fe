import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { searchSongs, type SongSearchResult } from "~/lib/musicbrainz";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import { Skeleton } from "~/components/ui/skeleton";

const SEARCH_DEBOUNCE_MS = 1000;
const SEARCH_LOADING_KEYS = [
  "loading-song-1",
  "loading-song-2",
  "loading-song-3",
];

type AddSongSearchProps = {
  existingSongIds: Set<string>;
  disabled?: boolean;
  onAdd: (song: SongSearchResult) => Promise<void>;
};

export function AddSongSearch({
  existingSongIds,
  disabled = false,
  onAdd,
}: AddSongSearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const trimmed = searchValue.trim();
    const timeoutId = window.setTimeout(
      () => setDebouncedQuery(trimmed),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  const {
    data: results = [],
    isFetching: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ["musicbrainz-search", debouncedQuery],
    queryFn: ({ signal }) => searchSongs(debouncedQuery, 10, signal),
    enabled: !!debouncedQuery,
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const hasQuery = searchValue.trim().length > 0;

  async function handleSelect(song: SongSearchResult) {
    await onAdd(song);
    setSearchValue("");
    setDebouncedQuery("");
  }

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold text-zinc-950">Add a new song</h3>
      <p className="text-sm text-zinc-600">
        Start typing a song title or artist and select a result to add it
        instantly.
      </p>

      <div className="mt-2">
        <Combobox<SongSearchResult>
          value={null}
          onValueChange={(song) => {
            if (!song) {
              return;
            }

            void handleSelect(song);
          }}
          inputValue={searchValue}
          onInputValueChange={(value) => {
            setSearchValue(value);
          }}
          itemToStringLabel={(song) => song.title}
          itemToStringValue={(song) => song.externalId}
          open={hasQuery && !disabled}
          disabled={disabled}
        >
          <ComboboxInput
            className="w-full"
            placeholder="Search by song title or artist"
            aria-label="Search songs on MusicBrainz"
            autoComplete="off"
            disabled={disabled}
            showClear={hasQuery}
          />

          {hasQuery && !disabled ? (
            <ComboboxContent className="overflow-hidden rounded-2xl border-zinc-200 bg-white shadow-lg shadow-black/5">
              {isSearching ? (
                <div className="flex flex-col gap-2 p-3">
                  {SEARCH_LOADING_KEYS.map((key) => (
                    <Skeleton key={key} className="h-12 rounded-xl" />
                  ))}
                </div>
              ) : searchError ? (
                <p className="p-3 text-sm text-red-600">
                  {searchError instanceof Error
                    ? searchError.message
                    : "We couldn't search MusicBrainz right now."}
                </p>
              ) : (
                <ComboboxList className="max-h-72 py-1">
                  <ComboboxEmpty className="justify-start p-3 text-zinc-500">
                    No songs found for &quot;{searchValue.trim()}&quot;.
                  </ComboboxEmpty>

                  {results.map((result) => {
                    const isAlreadyAdded = existingSongIds.has(
                      result.externalId,
                    );

                    return (
                      <ComboboxItem
                        key={result.externalId}
                        value={result}
                        disabled={isAlreadyAdded || disabled}
                        className="flex w-full flex-col items-start gap-0.5 rounded-xl px-3 py-2.5 text-left hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="text-sm font-medium text-zinc-950">
                          {result.title}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {result.artist}
                        </span>
                        {isAlreadyAdded ? (
                          <span className="text-xs font-medium text-amber-600">
                            Already saved
                          </span>
                        ) : null}
                      </ComboboxItem>
                    );
                  })}
                </ComboboxList>
              )}
            </ComboboxContent>
          ) : null}
        </Combobox>
      </div>
    </div>
  );
}
