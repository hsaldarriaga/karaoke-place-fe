import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NAV_ITEMS } from "~/modules/home/constants";
import type { HomeSection } from "~/modules/home/types";

type HomeSidebarProps = {
  activeSection: HomeSection;
};

export function HomeSidebar({ activeSection }: HomeSidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="border-none [&_[data-sidebar=sidebar]]:border-r [&_[data-sidebar=sidebar]]:border-zinc-200 [&_[data-sidebar=sidebar]]:bg-white"
    >
      <SidebarHeader className="gap-3 p-4 group-data-[collapsible=icon]:hidden">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Karaoke Place
          </p>
          <p className="mt-2 text-sm text-zinc-700">
            Browse and manage your karaoke plans.
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500">
            Browse
          </SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  asChild
                  isActive={activeSection === item.key}
                  tooltip={item.label}
                  className="h-auto items-start rounded-xl px-3 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                >
                  <Link to={item.to} className="gap-3">
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    <span className="flex min-w-0 flex-col text-left group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-semibold">
                        {item.label}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
