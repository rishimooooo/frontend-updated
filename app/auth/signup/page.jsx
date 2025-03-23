"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ Use Next.js Link

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

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
      if (res.ok) {
        setMessage("✅ Signup successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login"); // ✅ Redirect to login page
        }, 2000);
      } else {
        setMessage(data.message || "❌ Signup failed. Try again.");
      }
    } catch (error) {
      setMessage("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Signup</button>
        </form>
        <p>{message}</p>
        <p>
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
