import { useAppAuth } from "~/lib/auth";

export function Welcome() {
  const { error, isAuthenticated, isLoading, user } = useAppAuth();

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg shadow-black/5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Auth0 integration
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Secure sign-in for Karaoke Place
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-600">
            Universal Login is now wired into your React app so users can sign
            in without storing passwords in the frontend.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-600">
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1">
              React Router 7
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1">
              Auth0 SDK
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1">
              SSR-safe setup
            </span>
          </div>
        </section>

        {isLoading ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-black/5">
            <h2 className="text-2xl font-semibold">Checking your session…</h2>
            <p className="mt-2 text-zinc-600">
              The app is connecting to Auth0 and restoring any active login.
            </p>
          </section>
        ) : isAuthenticated ? (
          <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-black/5">
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name ?? "Authenticated user"}
                    className="h-16 w-16 rounded-full border border-zinc-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-lg font-semibold text-white">
                    {user?.name?.slice(0, 1) ?? "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                    Signed in
                  </p>
                  <h2 className="text-2xl font-semibold">
                    {user?.name ?? "Auth0 user"}
                  </h2>
                  {user?.email ? (
                    <p className="text-zinc-600">{user.email}</p>
                  ) : null}
                </div>
              </div>

              <a
                href="/logout"
                className="mt-6 inline-flex rounded-full bg-zinc-950 px-4 py-2 font-medium text-white transition hover:bg-zinc-800"
              >
                Log out
              </a>
            </div>

            <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-black/5">
              <h3 className="text-xl font-semibold">Next steps</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>
                  • Protect app routes based on <code>isAuthenticated</code>.
                </li>
                <li>
                  • Use <code>getAccessTokenSilently()</code> for secured API
                  calls.
                </li>
                <li>
                  • Add your production callback and logout URLs in Auth0.
                </li>
              </ul>
            </aside>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-black/5">
              <h2 className="text-2xl font-semibold">Sign in with Auth0</h2>
              <p className="mt-2 text-zinc-600">
                Use Auth0 Universal Login to authenticate users and return them
                to this app securely.
              </p>
              <a
                href="/login"
                className="mt-6 inline-flex rounded-full bg-zinc-950 px-4 py-2 font-medium text-white transition hover:bg-zinc-800"
              >
                Log in
              </a>
            </div>

            <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-black/5">
              <h3 className="text-xl font-semibold">Auth0 checklist</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                <li>
                  • Allowed Callback URLs: <code>https://localhost:8080</code>,{" "}
                  <code>https://127.0.0.1:8080</code>
                </li>
                <li>
                  • Allowed Logout URLs: <code>https://localhost:8080</code>,{" "}
                  <code>https://127.0.0.1:8080</code>
                </li>
                <li>
                  • Allowed Web Origins: <code>https://localhost:8080</code>,{" "}
                  <code>https://127.0.0.1:8080</code>
                </li>
                <li>
                  • Application type: <code>Single Page Application</code>
                </li>
              </ul>
            </aside>
          </section>
        )}

        {error ? (
          <p className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
