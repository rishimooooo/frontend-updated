"use client";
import styles from "./landing.module.css"; // ✅ Import CSS Module
import { useRouter } from "next/navigation";
import StoryList from "../components/StoryList";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // ✅ Check if user is logged in (Fetch from localStorage)
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log("User from localStorage:", loggedInUser); // ✅ Debugging Log
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    <div className={styles.landingContainer}>
      <div className={styles.overlay}></div> {/* Glassmorphic Overlay */}
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to StoryTime 📖</h1>
        <p className={styles.tagline}>
          Create, collaborate, and explore amazing stories with others.
        </p>

        <div className={styles.buttons}>
          {!user ? (
            <>
              <button
                className={`${styles.button} ${styles.loginBtn}`}
                onClick={() => router.push("/auth/login")}
              >
                Login
              </button>
              <button
                className={`${styles.button} ${styles.signupBtn}`}
                onClick={() => router.push("/auth/signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <p>✅ Logged in as {user.name}</p> {/* Debugging message */}
              <button
                className={`${styles.button} ${styles.createBtn}`}
                onClick={() => router.push("/create-story")}
              >
                ➕ Create a Story
              </button>
            </>
          )}
        </div>
      </div>
      <StoryList />
    </div>
  );
}
