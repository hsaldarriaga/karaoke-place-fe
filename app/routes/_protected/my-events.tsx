import { useSearchParams } from "react-router";
import { MyEventsSection } from "~/modules/home/my-events/my-events-section";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { query: currentUserQuery, currentUserId } = useCurrentUser();
  const page = normalizePage(searchParams.get("page"));
  const activeTab = normalizeActiveTab(searchParams.get("tab"));
  const { events, error, isLoading, pagination } = useMyEvents(
    currentUserId,
    page,
    activeTab,
  );

  function setPage(nextPage: number) {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextPage <= 1) {
      nextSearchParams.delete("page");
    } else {
      nextSearchParams.set("page", String(nextPage));
    }

    setSearchParams(nextSearchParams);
  }

  function setActiveTab(tab: string) {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("tab", tab);

    setSearchParams(nextSearchParams);
  }

  return (
    <MyEventsSection
      currentUserQuery={currentUserQuery}
      currentUserId={currentUserId}
      events={events}
      isLoading={isLoading}
      error={error}
      pagination={pagination}
      activeTab={activeTab}
      onPageChange={setPage}
      onTabChange={setActiveTab}
    />
  );
}

function normalizePage(rawPage: string | null) {
  const parsedPage = Number(rawPage);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

function normalizeActiveTab(rawTab: string | null) {
  return rawTab === "participating" ? "participating" : "created";
}
