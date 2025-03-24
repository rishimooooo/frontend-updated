"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://story-backend-1.onrender.com/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data._id,
            name: data.name,
            token: data.token,
          })
        );

        setMessage("✅ Signup successful! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard"); // ✅ Auto-login & redirect
        }, 1500);
      } else {
        setMessage(data.message || "❌ Signup failed. Try again.");
      }
    } catch (error) {
      setLoading(false);
      setMessage("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h1>🚀 Sign Up</h1>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="👤 Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "🚀 Signup"}
          </button>
        </form>
        <p>{message}</p>
        <p>
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
