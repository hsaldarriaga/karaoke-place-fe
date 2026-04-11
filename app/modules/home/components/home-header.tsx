import { Button } from "~/components/ui/button";
import { SidebarTrigger } from "~/components/ui/sidebar";

type HomeHeaderProps = {
  userEmail?: string;
};

export function HomeHeader({ userEmail }: HomeHeaderProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-900/85 p-6 shadow-2xl shadow-cyan-950/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <SidebarTrigger className="mt-0.5 text-slate-200 hover:bg-slate-800 hover:text-white" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Karaoke Place
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Plan your next karaoke night
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Discover live event ideas, keep track of your favorite songs, and
              jump back into the plans you already joined.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {userEmail ? (
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
              {userEmail}
            </span>
          ) : null}
          <Button asChild variant="outline">
            <a href="/logout">Log out</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
