"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    // ✅ Removed TypeScript ": React.FormEvent"
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://story-backend-1.onrender.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // ✅ Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.userId,
            name: data.name,
            token: data.token,
          })
        );

        setMessage("✅ Login successful!");
        setTimeout(() => {
          router.push("/landing"); // ✅ Redirect to landing page
        }, 1500);
      } else {
        setMessage(data.message || "❌ Invalid email or password!");
      }
    } catch (error) {
      setLoading(false);
      setMessage("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>{message}</p>
        <p>
          Don't have an account? <Link href="/auth/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
