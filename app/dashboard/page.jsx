"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.token) {
      router.push("/auth/login");
    } else {
      setUser(storedUser);
      fetchUserStories(storedUser.id);
    }
  }, [router]);

  const fetchUserStories = async (userId) => {
    try {
      const res = await fetch(
        `https://story-backend-1.onrender.com/api/stories/user/${userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch stories.");
      }

      const data = await res.json();
      setStories(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError("Could not load stories.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}! 🎉</h1>
      <p>Your User ID: {user.id}</p>

      <h2>Your Stories 📖</h2>
      {loading ? (
        <p>Loading your stories...</p>
      ) : error ? (
        <p>{error}</p>
      ) : stories.length > 0 ? (
        <ul>
          {stories.map((story) => (
            <li key={story._id}>
              <h3>{story.title}</h3>
              <p>{story.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No stories found.</p>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("user");
          router.push("/auth/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
