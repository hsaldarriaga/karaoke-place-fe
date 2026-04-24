import {
  getApiKaraokeEvents,
  getApiKaraokeEventsParticipantCounts,
  getApiKaraokeEventsSongProposals,
} from "~/gen/api";
import type {
  GetApiKaraokeEventsParams,
  KaraokeEvent,
  ParticipantCountByEventModel,
  SongModel,
  SongProposalsByEventModel,
} from "~/gen/models";

import { EVENTS_PAGE_SIZE } from "../constants";
import type { CurrentEventsPage, EnrichedKaraokeEvent } from "../types";

async function enrichEvents(
  events: KaraokeEvent[],
): Promise<EnrichedKaraokeEvent[]> {
  const eventIds = events.map((event) => event.id);

  const [participantCountsResult, proposalsResult] = await Promise.allSettled([
    eventIds.length > 0
      ? getApiKaraokeEventsParticipantCounts({ eventIds })
      : Promise.resolve([] as ParticipantCountByEventModel[]),
    eventIds.length > 0
      ? getApiKaraokeEventsSongProposals({
          EventIds: eventIds,
          LimitPerEvent: 3,
        })
      : Promise.resolve([] as SongProposalsByEventModel[]),
  ]);

  const participantCountsByEvent = new Map<number, number>();

  if (participantCountsResult.status === "fulfilled") {
    for (const participantCount of participantCountsResult.value) {
      if (participantCount.eventId == null) {
        continue;
      }

      participantCountsByEvent.set(
        participantCount.eventId,
        participantCount.count,
      );
    }
  }

  const proposalCountsByEvent = new Map<number, number>();
  const previewSongsByEvent = new Map<number, SongModel[]>();

  if (proposalsResult.status === "fulfilled") {
    for (const group of proposalsResult.value) {
      if (group.eventId == null) {
        continue;
      }

      const songProposals = group.songProposals ?? [];

      proposalCountsByEvent.set(group.eventId, songProposals.length);
      previewSongsByEvent.set(
        group.eventId,
        songProposals
          .map((proposal) => proposal.song)
          .filter((song): song is SongModel => song != null)
          .slice(0, 3),
      );
    }
  }

  return events.map((event) => {
    const eventId = event.id;
    const previewSongs =
      eventId == null ? [] : (previewSongsByEvent.get(eventId) ?? []);

    return {
      ...event,
      participantCount:
        eventId == null ? 0 : (participantCountsByEvent.get(eventId) ?? 0),
      previewSongs,
      proposalCount:
        eventId == null
          ? previewSongs.length
          : (proposalCountsByEvent.get(eventId) ?? previewSongs.length),
    };
  });
}

export async function fetchEnrichedEventsPage(
  params?: GetApiKaraokeEventsParams,
): Promise<CurrentEventsPage> {
  const page = await getApiKaraokeEvents({
    PageSize: EVENTS_PAGE_SIZE,
    ...params,
  });

  return {
    items: await enrichEvents(page.items ?? []),
    page: page.page,
    totalPages: page.totalPages,
    totalCount: page.totalCount,
  };
}

export async function fetchAllEnrichedEvents(
  params?: Omit<GetApiKaraokeEventsParams, "Page" | "PageSize">,
): Promise<EnrichedKaraokeEvent[]> {
  const firstPage = await fetchEnrichedEventsPage({
    ...params,
    Page: 1,
    PageSize: EVENTS_PAGE_SIZE,
  });

  const totalPages = Number(firstPage.totalPages ?? 1);

  if (totalPages <= 1) {
    return firstPage.items;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchEnrichedEventsPage({
        ...params,
        Page: index + 2,
        PageSize: EVENTS_PAGE_SIZE,
      }),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.items ?? []);
}
