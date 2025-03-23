"use client";
import { useEffect, useState } from "react";

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch(
          "https://story-backend-1.onrender.com/api/stories"
        );
        if (!res.ok) throw new Error("Failed to fetch stories");

        const data = await res.json();
        setStories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  if (loading) return <p className="loading-message">Loading stories... 📖</p>;

  if (error) return <p className="error-message">⚠️ Error: {error}</p>;

  return (
    <div className="stories-container">
      <h1 className="title">📚 All Stories</h1>
      <div className="stories-grid">
        {stories.map((story) => (
          <div key={story._id} className="story-card">
            <h2>{story.title}</h2>
            <p className="author">
              By: {story.author ? story.author.name : "Unknown"}
            </p>
            <p className="content">{story.content.substring(0, 100)}...</p>
            <button className="read-more-btn">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
}
