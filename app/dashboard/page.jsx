"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css"; // ✅ Import the CSS Module

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/auth/login"); // ✅ Redirect to login if not authenticated
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, [router]);

  if (!user) {
    return null; // Prevents flashing before redirect
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1>📖 Welcome to Your Dashboard</h1>
      <p>
        👤 Logged in as: <strong>{user.name}</strong>
      </p>

      {/* "Create New Story" button */}
      <Link href="/create-story">
        <button className={styles.createStoryBtn}>➕ Create New Story</button>
      </Link>

      {/* View Your Stories Button */}
      <Link href="/your-stories">
        <button className={styles.viewStoriesBtn}>📚 View Your Stories</button>
      </Link>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("user"); // ✅ Clear user session
          router.push("/auth/login"); // ✅ Redirect to login
        }}
        className={styles.logoutBtn}
      >
        🚪 Logout
      </button>
    </div>
  );
}
