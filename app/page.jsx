"use client"; // ✅ Fix for client-side hooks

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      router.push("/dashboard"); // ✅ Redirect logged-in users to Dashboard
    }
  }, []);

  return (
    <div className="container">
      <div className="glass-card">
        <h1>Welcome to Collaborative Storytelling</h1>
        <p>🚀 Start your journey by logging in or signing up!</p>
        <div className="auth-buttons">
          <Link href="/auth/login">
            <button>🔑 Login</button>
          </Link>
          <Link href="/auth/signup">
            <button>📝 Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
