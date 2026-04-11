import { useMemo } from "react";

import type { EnrichedKaraokeEvent } from "../types";

export function useMyEvents(
  allEvents: EnrichedKaraokeEvent[],
  currentUserId?: number,
) {
  return useMemo(() => {
    if (currentUserId == null) {
      return [];
    }

    return allEvents.filter((event) => {
      const createdByUser = event.createdByUserId === currentUserId;
      const joinedEvent = event.participantUserIds.includes(currentUserId);

      return createdByUser || joinedEvent;
    });
  }, [allEvents, currentUserId]);
}
