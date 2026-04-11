import { MyEventsSection } from "~/modules/home/components/my-events-section";
import { useCurrentEvents } from "~/modules/home/hooks/use-current-events";
import { useCurrentUser } from "~/modules/home/hooks/use-current-user";
import { useMyEvents } from "~/modules/home/hooks/use-my-events";

export function meta() {
  return [
    { title: "Karaoke Place | My Events" },
    {
      name: "description",
      content: "View karaoke events you created or joined.",
    },
  ];
}

export default function MyEventsPage() {
  const { query: currentUserQuery, currentUserId } = useCurrentUser();
  const { allEvents } = useCurrentEvents();
  const myEvents = useMyEvents(allEvents, currentUserId);

  return (
    <MyEventsSection
      currentUserQuery={currentUserQuery}
      currentUserId={currentUserId}
      myEvents={myEvents}
    />
  );
}
