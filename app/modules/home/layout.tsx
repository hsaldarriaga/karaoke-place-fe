import { Outlet, useLocation } from "react-router";

import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { useAppAuth } from "~/lib/auth";

import { HomeHeader } from "./components/home-header";
import { HomeSidebar } from "./components/home-sidebar";
import type { HomeSection } from "./types";

function getActiveSection(pathname: string): HomeSection {
  if (pathname.startsWith("/my-events")) {
    return "my-events";
  }

  if (pathname.startsWith("/my-songs")) {
    return "my-songs";
  }

  return "current-events";
}

export function HomeLayout() {
  const location = useLocation();
  const { user } = useAppAuth();
  const activeSection = getActiveSection(location.pathname);

  return (
    <SidebarProvider
      defaultOpen
      className="min-h-screen bg-zinc-50 text-zinc-950"
    >
      <HomeSidebar activeSection={activeSection} />

      <SidebarInset className="min-w-0 bg-transparent">
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <HomeHeader userEmail={user?.email} />

            <section className="mt-6 min-w-0">
              <Outlet />
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
