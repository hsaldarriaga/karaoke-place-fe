type AuthActionStateProps = {
  title: string;
  description: string;
};

export function AuthActionState({ title, description }: AuthActionStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-zinc-950">
      <section className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-lg shadow-black/5">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-zinc-600">{description}</p>
      </section>
    </main>
  );
}
