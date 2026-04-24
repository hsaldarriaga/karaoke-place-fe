import type { KaraokeEvent, SongModel } from "~/gen/models";

export type HomeSection = "current-events" | "my-events" | "my-songs";

export type EnrichedKaraokeEvent = KaraokeEvent & {
  participantCount: number;
  previewSongs: SongModel[];
  proposalCount: number;
};

export type CurrentEventsPage = {
  items: EnrichedKaraokeEvent[];
  page?: number | string;
  totalPages?: number | string;
  totalCount?: number | string;
};

export type PaginationState = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
};
