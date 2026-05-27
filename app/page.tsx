import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import StartSessionForm from "@/components/StartSessionForm";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Interview Coach
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Practice your answers and get AI-powered feedback on clarity,
            structure, and STAR compliance.
          </p>
        </div>

        <StartSessionForm />

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <a
            href="/history"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            View past sessions →
          </a>
        </p>
      </div>
    </main>
  );
}
