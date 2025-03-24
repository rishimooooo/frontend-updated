"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./yourStories.module.css"; // ✅ Import CSS for styling

export default function YourStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const { id } = JSON.parse(storedUser);
    fetchUserStories(id);
  }, [router]);

  const fetchUserStories = async (userId) => {
    try {
      const res = await fetch(
        `https://story-backend-1.onrender.com/api/stories/user/${userId}`
      );

      if (!res.ok) throw new Error("Failed to fetch stories.");
      const data = await res.json();
      setStories(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Handle Delete Story */
  const deleteStory = async (storyId) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(
        `https://story-backend-1.onrender.com/api/stories/${storyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${storedUser.token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete story.");
      setStories(stories.filter((story) => story._id !== storyId));
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  /** ✅ Handle Edit Story */
  const startEditing = (story) => {
    setEditingStory(story._id);
    setEditedTitle(story.title);
    setEditedContent(story.content);
  };

  const cancelEditing = () => {
    setEditingStory(null);
    setEditedTitle("");
    setEditedContent("");
  };

  const updateStory = async (storyId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(
        `https://story-backend-1.onrender.com/api/stories/${storyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser.token}`,
          },
          body: JSON.stringify({ title: editedTitle, content: editedContent }),
        }
      );

      if (!res.ok) throw new Error("Failed to update story.");
      const updatedStory = await res.json();

      setStories(
        stories.map((story) => (story._id === storyId ? updatedStory : story))
      );
      cancelEditing();
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>📚 Your Stories</h1>

      {stories.length > 0 ? (
        <ul className={styles.storyList}>
          {stories.map((story) => (
            <li key={story._id} className={styles.storyItem}>
              {editingStory === story._id ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button onClick={() => updateStory(story._id)}>
                    💾 Save
                  </button>
                  <button onClick={cancelEditing}>❌ Cancel</button>
                </div>
              ) : (
                <>
                  <h3>{story.title}</h3>
                  <p>{story.content}</p>
                  <div className={styles.actions}>
                    <button onClick={() => startEditing(story)}>✏️ Edit</button>
                    <button onClick={() => deleteStory(story._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No stories found.</p>
      )}
    </div>
  );
}
