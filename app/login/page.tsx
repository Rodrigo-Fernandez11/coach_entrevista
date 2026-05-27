import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Suspense fallback={<div className="text-gray-500">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
