type AuthActionStateProps = {
  title: string;
  description: string;
};

export function AuthActionState({ title, description }: AuthActionStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <section className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-2xl shadow-cyan-950/20">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-slate-300">{description}</p>
      </section>
    </main>
  );
}
