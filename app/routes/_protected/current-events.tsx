import { CurrentEventsSection } from "~/modules/home/current-events/current-events-section";
import { useCurrentEvents } from "~/modules/home/hooks/use-current-events";

export function meta() {
  return [
    { title: "Karaoke Place | Current Events" },
    {
      name: "description",
      content:
        "Browse active karaoke events and see what everyone is lining up.",
    },
  ];
}

export default function CurrentEventsPage() {
  const { query, allEvents, loadMoreRef } = useCurrentEvents();

  return (
    <CurrentEventsSection
      query={query}
      allEvents={allEvents}
      loadMoreRef={loadMoreRef}
    />
  );
}
