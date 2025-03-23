"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateStory.module.css";

export default function CreateStory() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // ✅ Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!user || !user.token) {
      setMessage("⚠️ You must be logged in to create a story.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://story-backend-1.onrender.com/api/stories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title,
            content,
            authorId: user.id,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Story created successfully!");
        setTimeout(() => router.push("/landing"), 1500);
      } else {
        setMessage(data.message || "❌ Failed to create story.");
      }
    } catch (error) {
      setLoading(false);
      setMessage("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.createContainer}>
      <div className={styles.glassCard}>
        <h1>Create a Story 📖</h1>
        <form onSubmit={handleSubmit} className={styles.createForm}>
          <input
            type="text"
            placeholder="Story Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.inputField}
          />
          <textarea
            placeholder="Write your story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className={styles.textareaField}
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className={styles.createButton}
          >
            {loading ? "Publishing..." : "Create Story"}
          </button>
        </form>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
