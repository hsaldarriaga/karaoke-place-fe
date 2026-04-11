import { MySongsSection } from "~/modules/home/components/my-songs-section";
import { useCurrentUser } from "~/modules/home/hooks/use-current-user";
import { useMySongs } from "~/modules/home/hooks/use-my-songs";

export function meta() {
  return [
    { title: "Karaoke Place | My Songs" },
    {
      name: "description",
      content: "Browse the karaoke songs saved to your profile.",
    },
  ];
}

export default function MySongsPage() {
  const { query: currentUserQuery, currentUserId } = useCurrentUser();
  const mySongsQuery = useMySongs(currentUserId);

  return (
    <MySongsSection
      currentUserQuery={currentUserQuery}
      mySongsQuery={mySongsQuery}
      currentUserId={currentUserId}
    />
  );
}
