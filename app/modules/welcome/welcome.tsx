import { useAppAuth } from "../lib/auth";

export function Welcome() {
  const { error, isAuthenticated, isConfigured, isLoading, user } =
    useAppAuth();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Auth0 integration
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Secure sign-in for Karaoke Place
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Universal Login is now wired into your React app so users can sign
            in without storing passwords in the frontend.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full bg-slate-800 px-3 py-1">
              React Router 7
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1">
              Auth0 SDK
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1">
              SSR-safe setup
            </span>
          </div>
        </section>

        {!isConfigured ? (
          <section className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-6 text-amber-50">
            <h2 className="text-2xl font-semibold">Finish the Auth0 config</h2>
            <p className="mt-2 text-sm text-amber-100/90">
              Copy <code>.env.example</code> to <code>.env</code> and add your
              Auth0 tenant details before testing login.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950/70 p-4 text-sm text-cyan-200">
              {`VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
HOSTNAME=https://localhost:8080
VITE_AUTH0_AUDIENCE=your-api-identifier`}
            </pre>
          </section>
        ) : isLoading ? (
          <section className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
            <h2 className="text-2xl font-semibold">Checking your session…</h2>
            <p className="mt-2 text-slate-300">
              The app is connecting to Auth0 and restoring any active login.
            </p>
          </section>
        ) : isAuthenticated ? (
          <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6">
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name ?? "Authenticated user"}
                    className="h-16 w-16 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold">
                    {user?.name?.slice(0, 1) ?? "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
                    Signed in
                  </p>
                  <h2 className="text-2xl font-semibold">
                    {user?.name ?? "Auth0 user"}
                  </h2>
                  {user?.email ? (
                    <p className="text-slate-200">{user.email}</p>
                  ) : null}
                </div>
              </div>

              <a
                href="/logout"
                className="mt-6 inline-flex rounded-full bg-white px-4 py-2 font-medium text-slate-900 transition hover:bg-slate-200"
              >
                Log out
              </a>
            </div>

            <aside className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
              <h3 className="text-xl font-semibold">Next steps</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
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
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
              <h2 className="text-2xl font-semibold">Sign in with Auth0</h2>
              <p className="mt-2 text-slate-300">
                Use Auth0 Universal Login to authenticate users and return them
                to this app securely.
              </p>
              <a
                href="/login"
                className="mt-6 inline-flex rounded-full bg-cyan-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-300"
              >
                Log in
              </a>
            </div>

            <aside className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6">
              <h3 className="text-xl font-semibold">Auth0 checklist</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
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
          <p className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
