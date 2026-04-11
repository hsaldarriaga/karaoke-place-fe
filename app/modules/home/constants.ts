import type { HomeSection } from "./types";

export const NAV_ITEMS: Array<{
  key: HomeSection;
  label: string;
  description: string;
  to: string;
}> = [
  {
    key: "current-events",
    label: "Current events",
    description: "Browse karaoke plans happening now.",
    to: "/current-events",
  },
  {
    key: "my-events",
    label: "My events",
    description: "Events you created or joined.",
    to: "/my-events",
  },
  {
    key: "my-songs",
    label: "My songs",
    description: "Your saved karaoke picks.",
    to: "/my-songs",
  },
];

export const EVENTS_PAGE_SIZE = 6;
