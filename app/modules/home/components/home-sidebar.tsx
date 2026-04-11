import { Link } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

import { NAV_ITEMS } from "../constants";
import { useCurrentEvents } from "../hooks/use-current-events";
import { useCurrentUser } from "../hooks/use-current-user";
import { useMyEvents } from "../hooks/use-my-events";
import { useMySongs } from "../hooks/use-my-songs";
import type { HomeSection } from "../types";

type HomeSidebarProps = {
  activeSection: HomeSection;
};

export function HomeSidebar({ activeSection }: HomeSidebarProps) {
  const { allEvents, totalEvents } = useCurrentEvents();
  const { currentUserId } = useCurrentUser();
  const myEvents = useMyEvents(allEvents, currentUserId);
  const mySongsQuery = useMySongs(currentUserId);

  const myEventsCount = myEvents.length;
  const mySongsCount = (mySongsQuery.data ?? []).length;

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="border-none [&_[data-sidebar=sidebar]]:border-r [&_[data-sidebar=sidebar]]:border-slate-800 [&_[data-sidebar=sidebar]]:bg-slate-900/95"
    >
      <SidebarHeader className="gap-3 p-4">
        <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Karaoke Place
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Browse and manage your karaoke plans.
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">
            Browse
          </SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  asChild
                  isActive={activeSection === item.key}
                  tooltip={item.label}
                  className="h-auto items-start px-3 py-3"
                >
                  <Link to={item.to}>
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-xs text-slate-400">
                      {item.description}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-2xl bg-slate-950/70 p-4 text-sm text-slate-300">
          <p className="font-medium text-slate-100">Quick summary</p>
          <ul className="mt-3 space-y-2">
            <li>• {totalEvents} active events available</li>
            <li>
              • {myEventsCount} event{myEventsCount === 1 ? "" : "s"} linked to
              you
            </li>
            <li>
              • {mySongsCount} saved song
              {mySongsCount === 1 ? "" : "s"}
            </li>
          </ul>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
