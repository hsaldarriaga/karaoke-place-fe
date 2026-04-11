import {
  Calendar03Icon,
  MusicNote01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import type { HomeSection } from "./types";

export const NAV_ITEMS: Array<{
  key: HomeSection;
  label: string;
  description: string;
  to: string;
  icon: typeof Calendar03Icon;
}> = [
  {
    key: "current-events",
    label: "Current events",
    description: "Browse karaoke plans happening now.",
    to: "/current-events",
    icon: Calendar03Icon,
  },
  {
    key: "my-events",
    label: "My events",
    description: "Events you created or joined.",
    to: "/my-events",
    icon: UserGroupIcon,
  },
  {
    key: "my-songs",
    label: "My songs",
    description: "Your saved karaoke picks.",
    to: "/my-songs",
    icon: MusicNote01Icon,
  },
];

export const EVENTS_PAGE_SIZE = 6;
