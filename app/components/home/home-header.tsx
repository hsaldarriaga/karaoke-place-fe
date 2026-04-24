import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { SidebarTrigger } from "~/components/ui/sidebar";

type HomeHeaderProps = {
  userEmail?: string;
};

export function HomeHeader({ userEmail }: HomeHeaderProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-black/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <SidebarTrigger className="mt-0.5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
              Karaoke Place
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
              Plan your next karaoke night
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base">
              Discover live event ideas, keep track of your favorite songs, and
              jump back into the plans you already joined.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {userEmail ? (
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
              {userEmail}
            </span>
          ) : null}
          <Button asChild>
            <Link to="/logout">Log out</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
