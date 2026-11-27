import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg-app text-text-muted">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
